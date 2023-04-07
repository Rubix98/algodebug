import { Static, Record, String, Number } from "runtypes";

export const Variable = Record({
    id: String.withConstraint((s) => /^.*@[0-9]+$/.test(s)),
    start: Number,
    end: Number,
    name: String,
});

export type Variable = Static<typeof Variable>;

export const sanitizeVariables = (m: Variable[]) => {
    return m.map((v) => {
        return { id: v.id, start: v.start, end: v.end, name: v.name };
    }) as Variable[];
};
