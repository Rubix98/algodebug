import passport from "passport";
import { Provider } from "./structures/Provider";
import { NextFunction, Request, Response } from "express";
import { User } from "./model";
import { updateUser, validateUserUpdate } from "./service";
import { ObjectId, WithId } from "mongodb";
import { getCollections } from "../service";

type RequestData = {
    user: User;
    referer: string;
};

const checkProvider = (provider: string) => {
    try {
        Provider.check(provider);
        return true;
    } catch (e) {
        return false;
    }
};

export const authUser = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.params.provider;
    const referer = req.headers.referer;

    if (!checkProvider(provider)) {
        res.status(400).json({ error: "Invalid provider" });
    } else {
        passport.authenticate("google", { scope: ["email", "profile"], state: referer })(req, res, next);
    }
};

export const authCallback = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.params.provider;
    if (!checkProvider(provider)) {
        res.status(400).json({ error: "Invalid provider" });
    } else {
        passport.authenticate("google", {
            successRedirect: "/auth/success",
            failureRedirect: "/error",
            failureMessage: true,
            state: req.query.state as string | undefined,
        })(req, res, next);
    }
};

export const authSuccess = (req: Request, res: Response) => {
    // will send message to window opener (main AlgoDebug window)
    // with user data and script to close auth window
    res.setHeader("Content-Type", "text/html");

    const data = req.user as RequestData;
    const user = JSON.stringify(data.user);

    const script =
        "<script>" +
        "window.onload = () => {" +
        "if (!window.opener) return;" +
        `window.opener.postMessage(${user}, "${data.referer}");` +
        "window.close()" +
        "}" +
        "</script>";
    req.login(data.user, () => {
        res.send(script);
    });
};

export const authLogout = (req: Request, res: Response) => {
    req.logout(() => {
        res.status(200).json({ loggedIn: false });
    });
};

export const authVerify = (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ loggedIn: true, user: req.user as User });
    } else {
        res.status(200).json({ loggedIn: false });
    }
};

export const updateUsername = async (req: Request, res: Response) => {
    const newUsername = req.body["username"];
    const user = req.user as WithId<User>;
    const id = new ObjectId(user._id);

    const updateData = validateUserUpdate({
        username: newUsername,
    });

    if (!updateData.isOk) {
        res.status(400).json({ error: updateData.error });
        return;
    }

    const result = await updateUser({ _id: id, ...updateData.value });

    if (!result) {
        res.status(500).json({ error: "Database error" });
        return;
    }

    // updates user in session (req.user)
    req.login(result, () => {
        res.status(200).json(result);
    });
};
