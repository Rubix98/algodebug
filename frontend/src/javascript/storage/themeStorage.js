export function getCurrentThemeFromStorage() {
    const theme = localStorage.getItem("theme");
    return theme == null ? "dark" : theme;
}

export function setCurrentThemeInStorage(theme) {
    localStorage.setItem("theme", theme);
}
