const { translations, exclusionRegex } = require('./translations.js');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'docs');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isDirectory(filePath) {
    return fs.statSync(filePath).isDirectory();
}

function enumerateMdFiles(dir) {
    const files = fs.readdirSync(dir);
    let mdFiles = [];
    
    for (const file of files) {
        const filePath = path.join(dir, file);

        if (isDirectory(filePath)) {

            mdFiles = mdFiles.concat(enumerateMdFiles(filePath));
        } else if (file.endsWith('.md') || file.endsWith('.yml')) {

            if (!exclusionRegex.test(filePath))
                mdFiles.push(filePath);
        }
    }

    return mdFiles;
}

async function runInference(text) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.error("GROQ_API_KEY environment variable is not set.");
        process.exit(1);
    }
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            messages: [{
                role: 'user',
                content: text
            }],
            temperature: 0.1,
            top_p: 0.75,
            max_tokens: 8192
        })
    });

    if (!response.ok) {

        const resJson = await response.json();
        if (resJson.error?.code == "rate_limit_exceeded") {
            const retryAfter = response.headers.get("Retry-After") * 3;
            console.error("Rate limit exceeded! Retrying in " + retryAfter + " seconds.");
            await sleep(retryAfter * 1000);

            return await runInference(text, prompt);

        } else {
            console.error("Failed to translate the markdown file.");
            console.error(await response.text());
            process.exit(1);
        }
    }

    const data = await response.json();

    return data.choices[0].message.content;
}

const mdFiles = enumerateMdFiles(targetDir);

function getPrompt(toLanguage, fileName, text) {
    const baseText = `
You're translating a piece of documentation of the Sisk Framework, an .NET web-server written in C#. Translate the translation input text to ${toLanguage}.

Rules:
- You SHOULD translate texts, code comments, but not code symbols, variables or constants names.
- You MUST NOT translate script-header file names or language names.
- You MUST keep the same file structure, maintaining links targets, headers, codes and page title.
- You SHOULD NOT translate HTML tag names inside Markdown.
- You SHOULD NOT translate markdown warning boxes tags, such as [!TIP] or [!WARNING].
- You MUST keep absolute link targets (eg. links which points to "/spec" or starts with "https://...").
- You SHOULD ONLY translate YAML values, NOT the keys.
- You MUST NOT translate YAML keys.
- You MUST NOT alter the YAML file structure.
- You MUST reply ONLY with the translated text, no greetings, advices or comments.
- The translated text must follow the original input structure.

File name: ${fileName}
        
<translation-input>
${text}
</translation-input>
    `;

    return baseText;
}

(async () => {
    var translatedCount = 0;

    for (const mdFile of mdFiles) {
        const fileContents = fs.readFileSync(mdFile, 'utf8');

        const fileName = mdFile.replace(targetDir, '');

        for (const [langName, langCode] of Object.entries(translations)) {
            
            const prompt = getPrompt(langName, fileName, fileContents);
            const translationPath = path.join(targetDir, langCode, fileName);
            const translationDir = path.dirname(translationPath);

            if (fs.existsSync(translationPath)) {
                continue;
            }
            
            const translated = (await runInference(prompt))
                .replaceAll("/docs/", `/docs/${langCode}/`);

            fs.mkdirSync(translationDir, { recursive: true });
            fs.writeFileSync(translationPath, translated);

            console.log("- Translated: ", translationPath);

            // wait 10s (rate-limit)
            await sleep(500);
            translatedCount++;
        }
    }
    
    if (translatedCount == 0) {
        console.log("No files to translate.");
    } else {
        console.log(`${translatedCount} files translated.`);
    }

})().then(() => console.log("Finished!"));