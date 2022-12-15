import { sendRequest } from "@/javascript/utils/axiosUtils";

const toggleLoginButton = (show) => {
    document.getElementById("google-login-button").classList.toggle("hidden", show);
    document.getElementById("logout-button").classList.toggle("hidden", !show);
};

export const handleGoogleLogin = (res) => {
    // attach withCredentials to the request
    sendRequest("/user/google/login/" + res.credential, { withCredentials: true }, "GET").then((res) => {
        if (!res.logedIn) return;

        // hide login button and show logout button
        toggleLoginButton(true);
    });
};

export const handleGoogleLogout = () => {
    sendRequest("/user/google/logout", { withCredentials: true }, "GET").then((res) => {
        if (res.logedIn) return;

        // hide logout button and show login button
        toggleLoginButton(false);
    });
};

export const checkGoogleLogin = () => {
    sendRequest("/user/google/verify", { withCredentials: true }, "GET").then((res) => {
        if (!res.logedIn) return;

        // hide login button and show logout button
        toggleLoginButton(true);
    });
};
