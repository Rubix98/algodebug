import { ValidTypeOrError } from "../types";
import { Converter, sanitizeConverter } from "./model";

export const validateConverter = (req: unknown): ValidTypeOrError<Converter> => {
    try {
        const converter = sanitizeConverter(Converter.check(req));
        if (!converter) throw new Error("Converter cannot be null");
        return [true, converter];
    } catch (error) {
        return [false, error];
    }
};
