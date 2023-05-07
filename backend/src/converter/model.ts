import { Language } from "./structures/Language";
import { Static, Record, String, Unknown, Optional } from "runtypes";

import { ObjectId } from "mongodb";
import { isObjectId } from "../service";

export const Converter = Record({
    _id: Optional(Unknown.withGuard(isObjectId)),
    title: String.withConstraint((s) => s.length > 0),
    language: Language,
    code: String,
});

export type Converter = Static<typeof Converter>;

export const sanitizeConverter = (c: Converter | null) => {
    if (c === null) {
        return null;
    }
    return {
        _id: c._id ? new ObjectId(c._id) : undefined,
        title: c.title,
        language: c.language,
        code: c.code,
    } as Converter;
};
