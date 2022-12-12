import { sendRequest } from "@/javascript/utils/axiosUtils";

export const handleGoogleLogin = (res) => {
    sendRequest("/user/google/login/" + res.credential, {}, "GET").then((res) => {
        if (!res.logedIn) return;
        // hide login button and show logout button
        document.getElementById("google-login-button").classList.add("hidden");
        document.getElementById("logout-button").classList.remove("hidden");
    });
};

export const handleGoogleLogout = () => {
    sendRequest("/user/google/logout", {}, "GET").then((res) => {
        if (res.logedIn) return;
        // hide logout button and show login button
        document.getElementById("google-login-button").classList.remove("hidden");
        document.getElementById("logout-button").classList.add("hidden");
    });
};

export const checkLogin = () => {
    sendRequest("/user/google/verify", {}, "GET").then((res) => {
        if (!res.logedIn) return;

        // hide login button and show logout button
        document.getElementById("google-login-button").classList.add("hidden");
        document.getElementById("logout-button").classList.remove("hidden");
    });
};
