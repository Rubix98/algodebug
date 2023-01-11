export function formatDate(date) {
    return new Date(date).toISOString().split(".")[0].replace("T", " ");
}

export function redirectTo(url) {
    window.location.href = url;
}
