import { Converter, sanitize as sanitizeConverter } from "../models/Converter";
import { Static, Record, String, Number, Null } from "runtypes";

export const Mark = Record({
    start: Number,
    end: Number,
    name: String,
    type: String.Or(Null),
    converter: Converter.Or(Null),
});

export type Mark = Static<typeof Mark>;

export const sanitize = (m: Mark) => {
    return {
        start: m.start,
        end: m.end,
        name: m.name,
        type: m.type,
        converter: sanitizeConverter(m.converter),
    } as Mark;
};
