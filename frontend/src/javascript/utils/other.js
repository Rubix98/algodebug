export function formatDate(date) {
    return new Date(date).toISOString().split(".")[0].replace("T", " ");
}

export function redirectTo(url) {
    window.location.href = url;
}

export function deepCopy(object) {
    return JSON.parse(JSON.stringify(object));
}
