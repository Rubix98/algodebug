import axios from "axios";
import toast, { getEndpointRelatedToast } from "@/javascript/utils/toastUtils";

export function sendRequest(url, data = {}, method) {
    if (!validateMethod(method)) return;
    axios.defaults.withCredentials = true;
    if (!data) data = {};

    const toastStrings = getEndpointRelatedToast(url);
    const loadingToast = toastStrings.loading ? toast.info(toastStrings.loading, { timeout: false }) : undefined;

    method = method.toLowerCase();
    url = BACKEND_URL + url;
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
            toast.error(
                url.startsWith("/compiler/compile") && error.response.data
                    ? error.response.data
                    : toastStrings.error
                    ? error.response.data
                    : "Wystąpił błąd! Spróbuj ponownie później."
            );
            throw error;
        })
        .finally(() => {
            if (loadingToast !== undefined) toast.dismiss(loadingToast);
        });
}

function validateMethod(method) {
    return method && ["get", "post", "put"].includes(method.toLowerCase());
}
