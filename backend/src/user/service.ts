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

    const user = {
        _id: profile.id,
        provider: provider,
        username: profile.displayName,
        // should always exist but technically not required in certain services
        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
        picture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null
    } as User;

    const [isOk, data] = validateUser(user);

    if (!isOk) {
        return null;
    }

    try {
        await saveUser(data);
    } catch (error) {
        return null;
    }

    return data;
};

const sanitizeUser = (u: User) => {
    const user = {
        _id: u._id,
        provider: u.provider,
        username: u.username,
        picture: u.picture,
        email: u.email,
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
    if (await getUserById(user._id, user.provider)) {
        await users.updateOne({ _id: user._id, provider: user.provider }, { $set: user });
    } else {
        await users.insertOne(user);
    }
};
