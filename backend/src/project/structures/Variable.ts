import { Static, Record, String, Number } from "runtypes";

export const Variable = Record({
    id: String.withConstraint((s) => /^.*@[0-9]+$/.test(s)),
    start: Number,
    end: Number,
    name: String,
});

export type Variable = Static<typeof Variable>;

export const sanitizeVariable = (m: Variable) => {
    return {
        id: m.id,
        start: m.start,
        end: m.end,
        name: m.name,
    } as Variable;
};
