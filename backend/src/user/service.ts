import passport from "passport";
import { Record } from "runtypes";
import { WithId } from "mongodb";

import { initializeGoogle } from "./strategies/google";
import { asyncTryCatchAssign } from "../shared/handling";
import { getCollections } from "../db";
import { Subset, ValidTypeOrError } from "../shared/types";
import { profileEssentials } from "./types";
import { sanitizeUser, User } from "./model";
import { Provider } from "./structures/Provider";
import { Uuid } from "./structures/Uuid";
import { RoleEnum } from "./structures/Role";

export const initializePassport = () => {
    initializeGoogle();

    passport.serializeUser((user, done: (arg0: null, arg1: any) => any) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done: (arg0: null, arg1: any) => any) => {
        return done(null, user);
    });
};

export const validateUser = (data: unknown): ValidTypeOrError<User> => {
    try {
        return { isOk: true, value: sanitizeUser(User.check(data)) };
    } catch (error) {
        return { isOk: false, error: error };
    }
};

/**
 * Less strict validation for updating user data.
 * All fields are optional but must be of the correct type if present.
 */
export const validateUserUpdate = (data: unknown): ValidTypeOrError<Subset<User>> => {
    const subsetRuntype = Record(User.fields).asPartial();

    try {
        return { isOk: true, value: sanitizeUser(subsetRuntype.check(data)) };
    } catch (error) {
        return { isOk: false, error: error };
    }
};

export const getUserByUuid = async (uuid: Uuid): Promise<WithId<User> | null> => {
    const { users } = getCollections();
    return await users.findOne({ uuid: uuid });
};

const createUser = async (uuid: Uuid, data: profileEssentials): Promise<WithId<User> | null> => {
    const { users } = getCollections();

    const user = validateUser({
        uuid: uuid,
        username: data.displayName,
        role: RoleEnum.USER,

        // should always exist but technically not required in certain services
        email: data.emails && data.emails.length > 0 ? data.emails[0].value : null,
        picture: data.photos && data.photos.length > 0 ? data.photos[0].value : null,
    });

    if (!user.isOk) return null;

    const result = await asyncTryCatchAssign(users.insertOne(user.value));
    if (!result.isOk) return null;

    const insertedId = result.value.insertedId;
    return { ...user.value, _id: insertedId } as WithId<User>;
};

export const updateUser = async (data: WithId<Subset<User>>) => {
    const { users } = getCollections();

    const user = validateUserUpdate(data);
    if (!user.isOk || !user.value._id) return null;

    const [id, withoutId] = (({ _id, ...o }) => [_id, o])(user.value);
    const result = await asyncTryCatchAssign(users.updateOne({ _id: id }, { $set: withoutId }));

    if (!result.isOk) return null;

    return await users.findOne({ _id: id });
};

export const processUserAuthAttempt = async (provider: Provider, profile: passport.Profile) => {
    const uuid = { id: profile.id, provider: provider } as Uuid;

    const user = await getUserByUuid(uuid);
    if (!user) {
        return await createUser(uuid, profile);
    }

    // these fields will by updated on every login
    const toUpdate = {
        // username: profile.displayName,

        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
        picture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
    } as Subset<User>;

    const updatedUser = await updateUser({ _id: user._id, ...toUpdate });
    return updatedUser;
};
