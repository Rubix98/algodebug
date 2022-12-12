import { Request, Response } from "express";
import { processUser, verifyGoogleToken, updateAlgoToken, verifyAlgoToken } from "../services/authservice";

export const loginGoogle = async (req: Request, res: Response) => {
    // get google token, verify it, create AlgoToken for user
    const token = req.params.token;
    const payload = await verifyGoogleToken(token);
    const AlgoToken = await processUser(payload);

    // TODO: handle error
    if (!AlgoToken) {
        res.status(500).send();
        return;
    }

    res.cookie("AlgoToken", AlgoToken, { httpOnly: true }); // secure: true for https
    res.status(200).json({ logedIn: true });
};

export const logoutGoogle = async (req: Request, res: Response) => {
    const token = req.cookies.AlgoToken;
    if (!token) {
        res.status(400).send();
        return;
    }

    const [isOk, data] = await verifyAlgoToken(token);

    if (!isOk) {
        res.status(400).send();
        return;
    }

    const [method, id] = data.split("-");

    // will expire immediately
    updateAlgoToken(method, id, "");
    res.cookie("AlgoToken", "", { maxAge: 1, httpOnly: true });
    res.status(200).json({ logedIn: false });
};

export const verifyGoogle = async (req: Request, res: Response) => {
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
