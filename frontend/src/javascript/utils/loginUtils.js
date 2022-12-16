import { sendRequest } from "@/javascript/utils/axiosUtils";

export const initializeGoogle = () => {
    /* global google */

    google.accounts.id.initialize({
        client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
    });

    google.accounts.id.renderButton(document.getElementById("google-login-button"), {
        theme: "outline",
        size: "large",
    });
};

const toggleLoginButton = (show) => {
    document.getElementById("google-login-button").classList.toggle("hidden", show);
    document.getElementById("logout-button").classList.toggle("hidden", !show);
};

export const handleGoogleLogin = (res) => {
    sendRequest("/user/google/login/" + res.credential, { withCredentials: true }, "GET").then((res) => {
        if (!res.loggedIn) return;

        // hide login button and show logout button
        toggleLoginButton(true);
    });
};

export const handleLogout = () => {
    sendRequest("/user/logout", { withCredentials: true }, "GET").then((res) => {
        if (res.loggedIn) return;

        // hide logout button and show login button
        toggleLoginButton(false);
    });
};

export const checkLogin = () => {
    sendRequest("/user/verify", { withCredentials: true }, "GET").then((res) => {
        if (!res.loggedIn) return;

        // hide login button and show logout button
        toggleLoginButton(true);
    });
};
