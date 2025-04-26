export const translations = {
    "English": "en" 
};

export const exclusionRegex = new RegExp(`[\\\\/](${Object.values(translations).join('|')})[\\\\/]`, 'i');