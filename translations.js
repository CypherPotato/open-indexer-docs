export const translations = {
    "Portuguese": "pt-br"
};

export const exclusionRegex = new RegExp(`[\\\\/](${Object.values(translations).join('|')})[\\\\/]`, 'i');
