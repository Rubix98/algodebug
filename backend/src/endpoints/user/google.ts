import { Request, Response } from "express";
import { handleGoogleLoginRequest, verifyGoogleToken } from "../../services/authservice";

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
        res.status(500).send("Error while creating AlgoToken");
        return;
    }

    res.cookie("AlgoToken", AlgoToken, { httpOnly: true }); // TODO secure: true for https
    res.status(200).json({ loggedIn: true });
};
