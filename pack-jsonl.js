#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

const helpText = `Usage: bun pack-jsonl.js [options]

Packages the English Markdown documentation into JSONL records for AIVAX RAG imports.

Options:
  -i, --input <dir>       English Markdown docs directory. Default: docs
  -o, --output <file>     Output JSONL file. Default: jsonl-exports/aivax-documentation.jsonl. Use - for stdout
  -u, --base-url <url>    Public base URL. Default: https://docs.aivax.net/docs
  --single-page           Emit one record per page instead of one record per section
  -h, --help              Show this help

The default input points to docs/ and skips docs/pt-br.
By default, Markdown pages are chunked only by # and ## sections.
`;

if (args.includes('-h') || args.includes('--help')) {
    console.log(helpText);
    process.exit(0);
}

let inputDir = path.join(__dirname, 'docs');
let outputFile = path.join(__dirname, 'jsonl-exports', 'aivax-documentation.jsonl');
let baseUrl = 'https://docs.aivax.net/docs';
let singlePage = false;

for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-i' || arg === '--input') {
        inputDir = path.resolve(args[++i] || '');
    } else if (arg === '-o' || arg === '--output') {
        const outputArg = args[++i] || '';
        outputFile = outputArg === '-' ? '-' : path.resolve(outputArg);
    } else if (arg === '-u' || arg === '--base-url') {
        baseUrl = (args[++i] || '').replace(/\/$/, '');
    } else if (arg === '--single-page') {
        singlePage = true;
    } else {
        console.error(`Unknown option: ${arg}`);
        console.error(helpText);
        process.exit(1);
    }
}

if (!fs.existsSync(inputDir)) {
    console.error(`Input directory not found: ${inputDir}`);
    process.exit(1);
}

function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true })
        .flatMap(item => {
            const itemPath = path.join(dir, item.name);
            return item.isDirectory() ? walk(itemPath) : [itemPath];
        });
}

function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'section';
}

function cleanMarkdown(markdown) {
    return markdown
        .replace(/\r/g, '')
        .replace(/^---\n[\s\S]*?\n---\n/, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function getMarkdownTitle(markdown, filePath) {
    const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
    return title || path.basename(filePath, path.extname(filePath));
}

function splitSections(markdown, pageTitle) {
    const lines = markdown.split('\n');
    const sections = [];
    let current = null;
    let inFence = false;

    for (const line of lines) {
        if (/^\s*```/.test(line)) {
            inFence = !inFence;
        }

        const heading = !inFence ? line.match(/^(#{1,2})\s+(.+?)\s*#*\s*$/) : null;

        if (heading) {
            if (current?.lines.length) {
                sections.push(current);
            }

            const headingText = heading[2].trim();
            current = {
                heading: headingText,
                anchor: slugify(headingText),
                lines: [line]
            };
            continue;
        }

        if (!current) {
            current = {
                heading: pageTitle,
                anchor: slugify(pageTitle),
                lines: []
            };
        }

        current.lines.push(line);
    }

    if (current?.lines.length) {
        sections.push(current);
    }

    return sections
        .map(section => ({
            heading: section.heading,
            anchor: section.anchor,
            text: cleanMarkdown(section.lines.join('\n'))
        }))
        .filter(section => section.text);
}

function makeRecord(filePath, section, pageTitle) {
    const relativePath = path.relative(inputDir, filePath).replace(/\\/g, '/');
    const docsRelativePath = relativePath;
    const pagePath = relativePath.replace(/\.md$/i, '');
    const sectionSlug = slugify(section.anchor);
    const urlPath = relativePath.replace(/\.md$/i, '.html');
    const url = `${baseUrl}/${urlPath}${section.anchor ? `#${section.anchor}` : ''}`;
    const pathTags = pagePath.split('/').filter(part => part && part !== 'index');

    return {
        docid: `${docsRelativePath}${sectionSlug ? `#${sectionSlug}` : ''}`,
        text: section.text,
        __ref: docsRelativePath,
        __tags: ['aivax', 'docs', 'english', ...pathTags],
        __meta: {
            title: pageTitle,
            heading: section.heading,
            path: docsRelativePath,
            url
        }
    };
}

const markdownFiles = walk(inputDir)
    .filter(file => file.endsWith('.md'))
    .filter(file => !/(^|[\\/])toc\.ya?ml$/i.test(file))
    .filter(file => !path.relative(inputDir, file).replace(/\\/g, '/').startsWith('pt-br/'))
    .sort((a, b) => a.localeCompare(b));

const records = [];

for (const file of markdownFiles) {
    const markdown = cleanMarkdown(fs.readFileSync(file, 'utf8'));
    const pageTitle = getMarkdownTitle(markdown, file);
    const sections = singlePage
        ? [{ heading: pageTitle, anchor: '', text: markdown }]
        : splitSections(markdown, pageTitle);

    for (const section of sections) {
        records.push(makeRecord(file, section, pageTitle));
    }
}

const jsonl = records.map(record => JSON.stringify(record)).join('\n');

if (outputFile === '-') {
    process.stdout.write(jsonl ? `${jsonl}\n` : '');
    console.error(`Packed ${records.length} records`);
} else {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, jsonl ? `${jsonl}\n` : '', 'utf8');
    console.error(`Packed ${records.length} records into ${outputFile}`);
}
