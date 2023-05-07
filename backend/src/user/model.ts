import { Static, Record, String, Null, Unknown, Optional } from "runtypes";
import { Uuid, sanitizeUuid } from "./structures/Uuid";
import { isObjectId } from "../service";
import { Subset, TypeLike } from "../types";

export const User = Record({
    _id: Optional(Unknown.withGuard(isObjectId)),
    uuid: Uuid,
    username: String.withConstraint((s) => s.length > 0),
    email: String.withConstraint((s) => s.length > 0).Or(Null),
    picture: String.withConstraint((s) => s.length > 0).Or(Null),
});

export type User = Static<typeof User>;

/**
 * Removes all properties from object that are not defined in the User runtype.
 * If object is exactly TypeLike<User>, that is, it has all the required properties of User
 * then the return type will be narrowed to User, otherwise it will be Subset<User>.
 */
export function sanitizeUser(u: TypeLike<User>): User;
export function sanitizeUser(u: TypeLike<Subset<User>>): Subset<User>;
export function sanitizeUser(u: TypeLike<Subset<User>>): Subset<User> | User {
    return {
        ...(u._id) && { _id: u._id },
        ...(u.uuid) && { uuid: sanitizeUuid(u.uuid) },
        ...(u.username) && { username: u.username },
        ...(u.email == null || u.email) && { email: u.email },
        ...(u.picture == null || u.picture) && { picture: u.picture },
    };
};
