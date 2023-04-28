import passport from "passport";
import { getCollections } from "../db";
import { ValidTypeOrError } from "../types";
import { sanitizeUser, User, Role } from "./model";
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
        uuid: {
            id: profile.id,
            provider: provider,
        },
        username: profile.displayName,

        // should always exist but technically not required in certain services
        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
        picture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
        role: Role.USER,
    };

    const [isOk, user] = validateUser(data);

    if (!isOk) {
        return null;
    }

    try {
        const userFromDB = await getUserByUuid(user.uuid);
        if (userFromDB) {
            user.role = userFromDB.role;
        } else {
            user.role = Role.USER;
        }
        const id = await saveUser(user);
        return { ...user, _id: id } as User;
    } catch (error) {
        return null;
    }
};

export const validateUser = (req: unknown): ValidTypeOrError<User> => {
    try {
        return [true, sanitizeUser(User.check(req))];
    } catch (error) {
        return [false, error];
    }
};

export const getUserByUuid = async (uuid: Uuid) => {
    const { users } = getCollections();
    return await users.findOne({ uuid: uuid });
};

export const saveUser = async (user: User) => {
    const { users } = getCollections();

    const id = (await getUserByUuid(user.uuid))?._id;

    // update user without overwriting _id
    // even if _id was the same this would throw an error if it was included
    delete user._id;

    if (id) {
        await users.updateOne({ _id: id }, { $set: user });
        return id;
    } else {
        const result = await users.insertOne(user);
        return result.insertedId;
    }
};
