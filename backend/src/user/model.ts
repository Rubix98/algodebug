import { Static, Record, String, Null, Unknown, Optional } from "runtypes";
import { Uuid, sanitizeUuid } from "./structures/Uuid";
import { isObjectId } from "../db";

export const User = Record({
    _id: Optional(Unknown.withGuard(isObjectId)),
    uuid: Uuid,
    username: String.withConstraint((s) => s.length > 0),
    // since these are provided by google I don't think some crazy regex is needed
    email: String.withConstraint((s) => s.length > 0).Or(Null),
    picture: String.withConstraint((s) => s.length > 0).Or(Null),
});

export type User = Static<typeof User>;

export const sanitizeUser = (u: User) => {
    return {
        _id: u._id,
        uuid: sanitizeUuid(u.uuid),
        username: u.username,
        email: u.email,
        picture: u.picture,
    } as User;
};
