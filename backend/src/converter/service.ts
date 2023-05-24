import { ValidTypeOrError } from "../shared/types";
import { Converter, sanitizeConverter } from "./model";

export const validateConverter = (req: unknown): ValidTypeOrError<Converter> => {
    try {
        const converter = sanitizeConverter(Converter.check(req));
        if (!converter) throw new Error("Converter cannot be null");
        return { isOk: true, value: converter };
    } catch (error) {
        return { isOk: false, error: error };
    }
};
