import { Static, Record, String } from "runtypes";
import { Provider } from "./structures/Provider";

export const User = Record({
    _id: String.withConstraint((s) => s.length > 0),
    provider: Provider,
    username: String.withConstraint((s) => s.length > 0),
});

export type User = Static<typeof User>;
