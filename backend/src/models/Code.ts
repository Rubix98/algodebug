import { Language } from "../structures/Language";
import { Static, Record, String, Array } from 'runtypes';

export const Code = Record({
    code: String,
    language: Language,
    inputs: Array(String)
});

export type Code = Static<typeof Code>;

export const sanitizeCode = (c: Code) => {
    return {
        code: c.code,
        language: c.language,
        inputs: c.inputs
    } as Code;
}
