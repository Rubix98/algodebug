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
