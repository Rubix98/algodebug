import axios from "axios";
import { useToast } from "vue-toastification";

const toast = useToast();

export function sendRequest(url, data = {}, method) {
    if (!validateMethod(method)) return;

    const loadingToast = toast.info("Trwa wysyłanie żądania do serwera...", { timeout: false });

    method = method.toLowerCase();
    url = getBackendUrl() + url;
    console.log(method, url);
    return axios[method](url, data)
        .then((response) => {
            console.log(response);
            toast.success("Żądanie zakończone sukcesem!\n" + method + " " + url);
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            let errorMessage = error.message + (error.response ? "\nDetails: " + error.response.data.error : "");
            toast.error("Żądanie nie powiodło się:\n" + method + " " + url + "\n" + errorMessage);
        })
        .finally(() => {
            toast.dismiss(loadingToast);
        });
}

function getBackendUrl() {
    return window.location.origin.includes("localhost") ? "http://localhost:8080" : "https://algodebug.herokuapp.com";
}

function validateMethod(method) {
    return method && ["get", "post", "put"].includes(method.toLowerCase());
}
