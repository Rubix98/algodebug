import passport from "passport";
import { getCollections } from "../app";
import { User } from "./model";
import { initializeGoogle } from "./strategies/google";
import { Provider } from "./structures/Provider";

type validUserOrError = [true, User] | [false, unknown];

export function initializePassport() {
    initializeGoogle();

    passport.serializeUser((user, done: (arg0: null, arg1: any) => any) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done: (arg0: null, arg1: any) => any) => {
        return done(null, user);
    });
}

export const processUser = async (provider: Provider, profile: passport.Profile) => {
    let user = null;

    try {
        user = await getUserById(profile.id, provider);
    } catch (error) {
        return null;
    }

    if (user == null) {
        const u = {
            _id: profile.id,
            provider: provider,
            username: profile.displayName,
        } as User;

        const [isOk, data] = validateUser(u);

        if (!isOk) {
            return null;
        }

        try {
            await saveUser(data);
            user = data;
        } catch (error) {
            return null;
        }
    }

    return user;
};

const sanitizeUser = (u: User) => {
    const user = {
        _id: u._id,
        provider: u.provider,
        username: u.username,
    } as User;

    return user;
};

export const validateUser = (req: unknown): validUserOrError => {
    try {
        return [true, sanitizeUser(User.check(req))];
    } catch (error) {
        return [false, error];
    }
};

export const getUserById = async (id: string, provider: Provider) => {
    const { users } = getCollections();
    const user = await users.findOne({ _id: id, provider: provider });
    return user;
};

export const saveUser = async (user: User) => {
    const { users } = getCollections();
    await users.insertOne(user);
};
