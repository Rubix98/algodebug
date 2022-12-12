import { getCollection } from "./dbservice";
import { User } from "../models/User";
import { validate } from "./dbservice";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const createAlgoToken = (id: string) => {
    return jwt.sign({ id: id }, process.env.ALGO_SECRET as string, { expiresIn: "1d" });
};

export const verifyGoogleToken = async (token: string) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
};

// returns user object if successful, null otherwise, will create new user if not found
export const processUser = async (userInfo: any) => {
    let user: any = await getUser("google", userInfo.sub).catch((err) => {
        console.log(err);
        return null;
    });

    if (!user) {
        const [isOk, newUser] = await validate(
            {
                method: "google",
                id: userInfo.sub,
                username: userInfo.name, // TODO: nickname support
                token: null,
            },
            User,
            "User"
        );

        if (!isOk) return null;

        user = await createNewUser(newUser);
    }

    // update token in db
    const id = "google-" + userInfo.sub;
    const token = createAlgoToken(id);
    const result = await updateAlgoToken("google", userInfo.sub, token);

    if (!result) return null;
    return token;
};

const createNewUser = async (user: User) => {
    const users = getCollection("users");
    try {
        const result = await users.insertOne(user, { forceServerObjectId: false });
        return result;
    } catch (err) {
        return null;
    }
};

export const getUser = async (method: string, id: string) => {
    const users = getCollection("users");
    try {
        const result = await users.findOne({ method: method, id: id });
        return result;
    } catch (err) {
        return null;
    }
};

export const updateAlgoToken = async (method: string, id: string, token: string | null) => {
    const users = getCollection("users");
    try {
        const result = await users.updateOne({ method: method, id: id }, { $set: { token: token } });
        return result;
    } catch (err) {
        return null;
    }
};

// this requires better error handling
export const verifyAlgoToken = async (token: string): Promise<[false, unknown] | [true, string]> => {
    try {
        const decoded = jwt.verify(token, process.env.ALGO_SECRET as string);

        if (!decoded || typeof decoded === "string") return [false, "Invalid token"];
        const [method, id] = decoded.id.split("-");
        const user = await getUser(method, id);
        if (!user || user.token != token) return [false, "Invalid token"];
        return [true, decoded.id];
    } catch (err) {
        return [false, err];
    }
};
