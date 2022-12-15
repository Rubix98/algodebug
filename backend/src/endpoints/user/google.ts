import { Request, Response } from "express";
import {
    handleGoogleLoginRequest,
    verifyGoogleToken,
    updateAlgoToken,
    verifyAlgoToken,
} from "../../services/authservice";

export const googleLogin = async (req: Request, res: Response) => {
    // get google token, verify it, create AlgoToken for user
    const token = req.params.token;
    const nickname = req.body.nickname;

    const payload = await verifyGoogleToken(token);

    if (!payload) {
        res.status(400).send("Invalid Google token");
        return;
    }

    const AlgoToken = await handleGoogleLoginRequest(payload, nickname);

    if (!AlgoToken) {
        res.status(500).send();
        return;
    }

    res.cookie("AlgoToken", AlgoToken, { httpOnly: true }); // secure: true for https
    res.status(200).json({ logedIn: true });
};

export const googleLogout = async (req: Request, res: Response) => {
    // get AlgoToken, verify it, then remove it from db and set cookie to expire
    const token = req.cookies.AlgoToken;

    if (!token) {
        res.status(400).send("No AlgoToken");
        return;
    }

    const [isOk, data] = await verifyAlgoToken(token);

    if (!isOk) {
        res.status(400).send(data);
        return;
    }

    const [method, id] = data.split("-");

    if (method !== "google") {
        res.status(400).send("Invalid method");
        return;
    }

    // will expire immediately
    updateAlgoToken(method, id, "");
    res.cookie("AlgoToken", "", { maxAge: 1, httpOnly: true });
    res.status(200).json({ logedIn: false });
};

export const googleVerify = async (req: Request, res: Response) => {
    const token = req.cookies.AlgoToken;

    if (!token) {
        res.status(200).json({ logedIn: false });
        return;
    }

    const [isOk, data] = await verifyAlgoToken(token);

    if (!isOk) {
        res.status(200).json({ logedIn: false });
        return;
    }

    res.status(200).json({ logedIn: true });
};
