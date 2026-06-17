#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

const helpText = `Usage: node pack-jsonl.js [options]

Packages the generated English documentation into JSONL records for AIVAX RAG imports.

Options:
  -i, --input <dir>       Generated English docs directory. Default: _site/docs/en
  -o, --output <file>     Output JSONL file. Defaults to stdout
  -u, --base-url <url>    Public base URL. Default: https://docs.aivax.net/docs/en
  --single-page           Emit one record per page instead of one record per section
  -h, --help              Show this help
`;

if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    console.log(helpText);
    process.exit(0);
}

let inputDir = path.join(__dirname, '_site', 'docs', 'en');
let outputFile = null;
let baseUrl = 'https://docs.aivax.net/docs/en';
let singlePage = false;

for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-i' || arg === '--input') {
        inputDir = path.resolve(args[++i] || '');
    } else if (arg === '-o' || arg === '--output') {
        outputFile = path.resolve(args[++i] || '');
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

function decodeHtml(text) {
    const named = {
        amp: '&',
        lt: '<',
        gt: '>',
        quot: '"',
        apos: "'",
        nbsp: ' '
    };

    return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (_, entity) => {
        if (entity[0] === '#') {
            const code = entity[1].toLowerCase() === 'x'
                ? parseInt(entity.slice(2), 16)
                : parseInt(entity.slice(1), 10);

            return Number.isFinite(code) ? String.fromCodePoint(code) : _;
        }

        return named[entity.toLowerCase()] || _;
    });
}

function htmlToText(html) {
    return decodeHtml(html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n')
        .replace(/<\/(h[1-6]|p|li|tr|table|blockquote|pre|div|section)>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<th[^>]*>/gi, ' | ')
        .replace(/<td[^>]*>/gi, ' | ')
        .replace(/<[^>]+>/g, '')
        .replace(/\r/g, '')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim());
}

function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'section';
}

function getArticle(html) {
    const match = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
    return match ? match[1] : null;
}

function getPageTitle(html, article) {
    const h1 = article.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    const title = html.match(/<title>([\s\S]*?)<\/title>/i);

    return htmlToText(h1?.[1] || title?.[1] || 'Untitled')
        .replace(/\s*\|\s*AIVAX\s*$/i, '')
        .trim();
}

function splitSections(article, pageTitle) {
    const headings = [...article.matchAll(/<h([1-4])\b([^>]*)>([\s\S]*?)<\/h\1>/gi)];

    if (headings.length === 0) {
        const text = htmlToText(article);
        return text ? [{ heading: pageTitle, anchor: slugify(pageTitle), text }] : [];
    }

    return headings
        .map((heading, index) => {
            const headingStart = heading.index;
            const contentStart = headingStart + heading[0].length;
            const next = headings[index + 1];
            const headingText = htmlToText(heading[3]);
            const id = heading[2].match(/\bid=["']([^"']+)["']/i)?.[1] || slugify(headingText);
            const body = article.slice(contentStart, next?.index ?? article.length);
            const text = htmlToText(`${heading[0]}\n${body}`);

            return text ? { heading: headingText, anchor: id, text } : null;
        })
        .filter(Boolean);
}

function makeRecord(filePath, section, pageTitle) {
    const relativePath = path.relative(inputDir, filePath).replace(/\\/g, '/');
    const docsRelativePath = `${path.basename(inputDir)}/${relativePath}`;
    const pagePath = relativePath.replace(/\.html$/i, '');
    const sectionSlug = slugify(section.anchor);
    const url = `${baseUrl}/${relativePath.replace(/\\/g, '/')}${section.anchor ? `#${section.anchor}` : ''}`;
    const pathTags = pagePath.split('/').filter(part => part && part !== 'index');

    return {
        docid: `${docsRelativePath}${sectionSlug ? `#${sectionSlug}` : ''}`,
        text: section.text,
        __ref: docsRelativePath,
        __tags: ['aivax', 'docs', 'en', ...pathTags],
        __meta: {
            title: pageTitle,
            heading: section.heading,
            path: docsRelativePath,
            url
        }
    };
}

const htmlFiles = walk(inputDir)
    .filter(file => file.endsWith('.html'))
    .filter(file => !/(^|[\\/])toc\.html$/i.test(file))
    .sort((a, b) => a.localeCompare(b));

const records = [];

for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const article = getArticle(html);

    if (!article) {
        continue;
    }

    const pageTitle = getPageTitle(html, article);
    const sections = singlePage
        ? [{ heading: pageTitle, anchor: '', text: htmlToText(article) }]
        : splitSections(article, pageTitle);

    for (const section of sections) {
        records.push(makeRecord(file, section, pageTitle));
    }
}

const jsonl = records.map(record => JSON.stringify(record)).join('\n');

if (outputFile) {
    fs.writeFileSync(outputFile, jsonl ? `${jsonl}\n` : '', 'utf8');
    console.error(`Packed ${records.length} records into ${outputFile}`);
} else {
    process.stdout.write(jsonl ? `${jsonl}\n` : '');
    console.error(`Packed ${records.length} records`);
}
