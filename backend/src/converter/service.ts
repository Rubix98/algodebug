import { ObjectId } from "mongodb";
import { Converter } from "./model";

type validConverterOrError = [true, Converter] | [false, unknown];

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

export const validateConverter = (req: unknown): validConverterOrError => {
    try {
        const converter = sanitizeConverter(Converter.check(req));
        if (!converter) throw new Error("Converter cannot be null");
        return [true, converter];
    } catch (error) {
        return [false, error];
    }
};
