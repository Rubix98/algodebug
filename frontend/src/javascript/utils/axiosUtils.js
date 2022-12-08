import axios from "axios";
import toast from "@/javascript/utils/toastUtils";

export function sendRequest(url, data = {}, method) {
    if (!validateMethod(method)) return;

    const toastStrings = getEndpointRelatedToast(method, url);
    const loadingToast = toastStrings.loading ? toast.info(toastStrings.loading, { timeout: false }) : undefined;

    method = method.toLowerCase();
    url = getBackendUrl() + url;
    console.log(method, url);
    return axios[method](url, data)
        .then((response) => {
            console.log(response);
            if (toastStrings.success) toast.success(toastStrings.success);
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            let errorMessage = error.message + (error.response ? "\nDetails: " + error.response.data.error : "");
            console.error(errorMessage);
            toast.error(toastStrings.error ? toastStrings.error : "Wystąpił błąd! Spróbuj ponownie później.");
        })
        .finally(() => {
            if (loadingToast != undefined) toast.dismiss(loadingToast);
        });
}

function getBackendUrl() {
    return window.location.origin.includes("localhost") ? "http://localhost:808" : "https://algodebug.herokuapp.com";
}

function validateMethod(method) {
    return method && ["get", "post", "put"].includes(method.toLowerCase());
}

function getEndpointRelatedToast(method, url) {
    if (url.startsWith("/project/find")) return { error: "Nie można pobrać projektu" };
    if (url.startsWith("/project/findAll")) return { error: "Nie można pobrać listy projektów" };
    if (url.startsWith("/converter/findAll")) return { error: "Nie można pobrać listy konwerterów" };

    if (url.startsWith("/project/save")) return { success: "Zapisano projekt w bazie danych" };
    if (url.startsWith("/compiler/compile"))
        return {
            success: "Pomyślnie skompilowano kod",
            loading: "Trwa kompilacja...",
            error: "Wystąpił błąd kompilacji",
        };
    if (url.startsWith("/converter/save")) return { success: "Zapisano konwerter w bazie danych" };

    if (method.toLowerCase() == "get") return {};
    return { success: "Pomyślnie zapisano" };
}
