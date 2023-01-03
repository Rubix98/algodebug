import { Language } from "../structures/Language";
import { Static, Record, String, Unknown, Optional, Null } from "runtypes";

import { ObjectId } from "mongodb";

const isId = (x: any): x is ObjectId => {
    if (!x) return false;
    try {
        new ObjectId(x);
        return true;
    } catch (e) {
        return false;
    }
};

export const Converter = Record({
    title: String.withConstraint((s) => s.length > 0),
    language: Language,
    code: String,

    _id: Optional(Unknown.withGuard(isId)),
});

export type Converter = Static<typeof Converter>;

export const sanitizeConverter = (c: Converter | null) => {
    if (c === null) {
        return null;
    }
    return {
        title: c.title,
        language: c.language,
        code: c.code,
        _id: c._id ? new ObjectId(c._id) : undefined,
    } as Converter;
};
