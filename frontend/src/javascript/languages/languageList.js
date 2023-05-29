import cpp from "@/javascript/languages/cpp";

const languages = {
    cpp: cpp,
    default: cpp,
};

export function getLanguage(name) {
    const language = languages[name];
    if (language == null) {
        console.error(`Language '${name}' does not exist. Using 'cpp' as default.`);
        return languages["default"];
    }
    return language;
}
