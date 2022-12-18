export function getCurrentThemeFromStorage() {
    const theme = localStorage.getItem("theme");
    return theme == null ? "light" : theme;
}

export function setCurrentThemeInStorage(theme) {
    localStorage.setItem("theme", theme);
}
