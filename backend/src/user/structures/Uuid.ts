import { Record, Static, String } from "runtypes";
import { Provider } from "./Provider";

export const Uuid = Record({
    id: String.withConstraint((s) => s.length > 0),
    provider: Provider,
});

export type Uuid = Static<typeof Uuid>;

export const sanitizeUuid = (u: Uuid) => {
    return {
        id: u.id,
        provider: u.provider,
    };
};
