import { getCollection, getUser, createNewUser } from "./dbservice";
import { Request, Response } from "express";
import { User } from "../models/User";
import { validate } from "./dbservice";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import jwt from "jsonwebtoken";
import { LoginMethod } from "../structures/LoginMethod";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const isValidMethod = (method: string): method is LoginMethod => {
    try {
        LoginMethod.check(method);
        return true;
    } catch (err) {
        return false;
    }
};

export const verifyGoogleToken = async (token: string) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
};

/**
 * encrypts provided string (user id) into a JWT
 * @param expiresIn time until token expires (default 1 day)
 */
export const createAlgoToken = (id: string, expiresIn = "1d") => {
    return jwt.sign({ id: id }, process.env.ALGO_SECRET as string, { expiresIn });
};

/**
 * Verifies AlgoToken (checks with secret, expiration time, and database match)
 * @param token AlgoToken to verify
 * @returns [true, user id] if token is valid, [false, error message] otherwise
 */
export const verifyAlgoToken = async (token: string): Promise<[boolean, string]> => {
    try {
        const decoded = jwt.verify(token, process.env.ALGO_SECRET as string);

        if (!decoded) return [false, "Invalid token"];
        if (typeof decoded === "string") return [false, decoded]; // decoded is error message
        // else decoded is jwt payload

        const [method, id] = decoded.id.split("-");
        const user = await getUser(method, id);

        if (!user) return [false, "User not found, please login again"];
        if (user.token !== token) return [false, "Invalid token"];
        // else token is valid

        return [true, decoded.id];
    } catch (err: any) {
        return [false, err.message];
    }
};

export const updateAlgoToken = async (method: LoginMethod, id: string, token: string | null) => {
    const users = getCollection("users");
    try {
        const result = await users.updateOne({ method: method, id: id }, { $set: { token: token } });
        return result;
    } catch (err) {
        return null;
    }
};

export const logoutUser = async (req: Request, res: Response) => {
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

    if (!isValidMethod(method)) {
        res.status(400).send("Invalid login method");
        return;
    }

    // will expire immediately
    updateAlgoToken(method, id, null);
    res.cookie("AlgoToken", null, { maxAge: 1, httpOnly: true });
    res.status(200).json({ loggedIn: false });
};

export const verifyUser = async (req: Request, res: Response) => {
    const token = req.cookies.AlgoToken;

    if (!token) {
        res.status(200).json({ loggedIn: false });
        return;
    }

    const [isOk, data] = await verifyAlgoToken(token);

    if (!isOk) {
        res.status(200).json({ loggedIn: false });
        return;
    }

    res.status(200).json({ loggedIn: true });
};

/**
 * Creates a new user if the user does not exist, otherwise returns the existing user
 * Will also create a new AlgoToken for the user and update it in the database
 * @param userInfo Google token payload
 * @returns AlgoToken if successful, null otherwise
 */
export const handleGoogleLoginRequest = async (userInfo: TokenPayload, nickname?: string) => {
    let user: User | null = await getUser("google", userInfo.sub).catch((err) => {
        console.log(err);
        return null;
    });

    if (!user) {
        const [isOk, newUser] = await validate(
            {
                method: "google",
                id: userInfo.sub,
                username: nickname ? nickname : userInfo.name,
                token: null,
            },
            User,
            "User"
        );

        if (!isOk) return null;

        await createNewUser(newUser);
    }

    // update token in db
    const id = "google-" + userInfo.sub;
    const token = createAlgoToken(id);
    const result = await updateAlgoToken("google", userInfo.sub, token);

    if (!result) return null;
    return token;
};
