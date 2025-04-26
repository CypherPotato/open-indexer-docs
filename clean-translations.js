import { translations, exclusionRegex } from './translations.js';
import { exec } from 'child_process';
import * as fs from 'fs';

function getModifiedFiles() {
    return new Promise((resolve, reject) => {
        exec('git ls-files -m', (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                
                const modifiedFiles = stdout
                    .trim()
                    .split('\n')
                    .filter(line => !exclusionRegex.test(line))
                    .filter(line => line.startsWith('docs/'))
                    .filter(line => line.endsWith('.md') || line.endsWith('.yml'));

                resolve(modifiedFiles);
            }
        });
    });
}

getModifiedFiles().then(modifiedFiles => {
    const availableTranslations = Object.values(translations);

    for (const modifiedFile of modifiedFiles) {
        for (const translationKey of availableTranslations) {
            const traslationPath = modifiedFile.replace("docs/", `docs/${translationKey}/`);

            if (fs.existsSync(traslationPath)) {
                console.log(`Removing ${traslationPath}`);
                fs.unlinkSync(traslationPath);
            }
        }
    }

}).catch(error => {
    console.error('Error: ', error);
});