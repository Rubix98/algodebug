import { Static, Record, Number, Null } from "runtypes";

export const Breakpoint = Record({
    id: Number.Or(Null),
});

export type Breakpoint = Static<typeof Breakpoint>;

export const sanitize = (b: Breakpoint) => {
    return {
        id: b.id,
    } as Breakpoint;
};
