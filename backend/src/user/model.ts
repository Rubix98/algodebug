import { Static, Record, String, Null } from "runtypes";
import { Uuid, sanitizeUuid } from "./structures/Uuid";

export const User = Record({
    _id: Uuid,
    username: String.withConstraint((s) => s.length > 0),
    // since these are provided by google I don't think some crazy regex is needed
    email: String.withConstraint((s) => s.length > 0).Or(Null),
    picture: String.withConstraint((s) => s.length > 0).Or(Null),
});

export type User = Static<typeof User>;

export const sanitizeUser = (u: User) => {
    return {
        _id: sanitizeUuid(u._id),
        username: u.username,
        email: u.email,
        picture: u.picture,
    } as User;
};
