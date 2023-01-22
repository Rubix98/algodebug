import { Static, Record, String, Null } from "runtypes";
import { Provider } from "./structures/Provider";

export const User = Record({
    _id: String.withConstraint((s) => s.length > 0),
    provider: Provider,
    username: String.withConstraint((s) => s.length > 0),
    // since these are provided by google I don't tihnk some crazy regex is needed
    email: String.withConstraint((s) => s.length > 0).Or(Null),
    picture: String.withConstraint((s) => s.length > 0).Or(Null),
});

export type User = Static<typeof User>;
