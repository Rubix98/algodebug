import axios from "axios";

export function sendRequest(url, data = {}, method) {
    if (!validateMethod(method)) return;

    method = method.toLowerCase();
    url = getBackendUrl() + url;
    console.log(method, url);
    return axios[method](url, data)
        .then((response) => {
            console.log(response);
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            let errorMessage =
                error.message + (error.response.data.error ? "\nDetails: " + error.response.data.error : "");
            alert(errorMessage);
            throw error;
        });
}

function getBackendUrl() {
    return window.location.origin.includes("localhost") ? "http://localhost:8080" : "http://srv16.mikr.us:40041";
}

function validateMethod(method) {
    return method && ["get", "post", "put"].includes(method.toLowerCase());
}
