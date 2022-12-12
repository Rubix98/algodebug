import { Static, Record, String, Null } from "runtypes";
import { LoginMethod } from "../structures/LoginMethod";

export const User = Record({
    method: LoginMethod,
    id: String,
    username: String,
    token: String.Or(Null),
});

export type User = Static<typeof User>;

export const sanitize = (u: User) => {
    return {
        method: u.method,
        id: u.id,
        username: u.username,
        token: u.token,
    } as User;
};
