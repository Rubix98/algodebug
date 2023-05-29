import cpp from "@/javascript/languages/cpp";

const languages = {
    cpp: cpp,
};

export function getLanguage(name) {
    return languages[name];
}
