import passport from "passport";
import { getCollections } from "../db";
import { ValidTypeOrError } from "../types";
import { sanitizeUser, User } from "./model";
import { initializeGoogle } from "./strategies/google";
import { Provider } from "./structures/Provider";
import { Uuid } from "./structures/Uuid";

export const initializePassport = () => {
    initializeGoogle();

    passport.serializeUser((user, done: (arg0: null, arg1: any) => any) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done: (arg0: null, arg1: any) => any) => {
        return done(null, user);
    });
};

export const processUserAuthAttempt = async (provider: Provider, profile: passport.Profile) => {
    const data = {
        _id: {
            id: profile.id,
            provider: provider,
        },
        username: profile.displayName,

        // should always exist but technically not required in certain services
        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
        picture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
    };

    const [isOk, user] = validateUser(data);

    if (!isOk) {
        return null;
    }

    try {
        await saveUser(user);
    } catch (error) {
        return null;
    }

    return data;
};

export const validateUser = (req: unknown): ValidTypeOrError<User> => {
    try {
        return [true, sanitizeUser(User.check(req))];
    } catch (error) {
        return [false, error];
    }
};

export const getUserById = async (uuid: Uuid) => {
    const { users } = getCollections();
    const user = await users.findOne({ _id: uuid });
    return user;
};

export const saveUser = async (user: User) => {
    const { users } = getCollections();
    const uuid = user._id;

    if (await getUserById(uuid)) {
        await users.updateOne({ _id: uuid }, { $set: user });
    } else {
        await users.insertOne(user);
    }
};
