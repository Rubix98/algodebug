import { useToast, POSITION } from "vue-toastification";

const toast = useToast();

export function getDefaultToastSettings() {
    return {
        position: POSITION.TOP_RIGHT,
        timeout: 3000,
    };
}

export default {
    success(text, options = undefined) {
        return toast.success(text, options);
    },

    info(text, options = undefined) {
        return toast.info(text, options);
    },

    warning(text, options = undefined) {
        return toast.warning(text, options);
    },

    error(text, options = undefined) {
        return toast.error(text, options);
    },

    dismiss(toastID) {
        toast.dismiss(toastID);
    },
};

export function getEndpointRelatedToast(url) {
    if (url.startsWith("/project/find")) return { error: "Nie można pobrać projektu" };
    if (url.startsWith("/project/findAll")) return { error: "Nie można pobrać listy projektów" };
    if (url.startsWith("/converter/findAll")) return { error: "Nie można pobrać listy konwerterów" };

    if (url.startsWith("/project/save"))
        return {
            success: "Zapisano projekt w bazie danych",
            error: "Nie można zapisać projektu w bazie danych",
        };
    if (url.startsWith("/converter/save"))
        return {
            success: "Zapisano konwerter w bazie danych",
            error: "Nie można zapisać konwertera w bazie danych",
        };
    if (url.startsWith("/compiler/compile"))
        return {
            success: "Pomyślnie skompilowano kod",
            loading: "Trwa kompilacja...",
            error: "Wystąpił błąd kompilacji",
        };

    console.warn(`Toasty dla endpointu ${url} nie zostały określone`);
    return {};
}
