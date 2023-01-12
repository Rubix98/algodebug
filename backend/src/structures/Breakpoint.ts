import { Static, Record, Number } from "runtypes";

export const Breakpoint = Record({
    id: Number,
});

export type Breakpoint = Static<typeof Breakpoint>;

export const sanitizeBreakpoint = (b: Breakpoint) => {
    return {
        id: b.id,
    } as Breakpoint;
};
