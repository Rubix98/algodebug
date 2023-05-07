import passport from "passport";
import { Provider } from "./structures/Provider";
import { NextFunction, Request, Response } from "express";
import { User } from "./model";
import { getUserByUuid } from "./service";
import { getCollections } from "../db";

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
    const reqUser = req.user as User;

    const newUsername = req.body["username"];

    if (!req.isAuthenticated()) {
        res.status(401).json({ error: "Unable to change the username for an unregistered user" });
        return;
    }

    if (newUsername === undefined) {
        res.status(400).json({ error: "Please enter a new username to set" });
        return;
    }

    const user = await getUserByUuid(reqUser.uuid);

    if (user == null) {
        res.status(404).json({ error: "This user could not be found in the database" });
        return;
    }

    try {
        user.username = newUsername;
        const { users } = getCollections();
        await users.updateOne({ _id: user._id }, { $set: user });
        res.status(200).send("OK");
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
};
