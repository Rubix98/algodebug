import { Language } from "../../converter/structures/Language";
import { Static, Record, String, Array } from "runtypes";

export const Code = Record({
    code: String,
    language: Language,
    inputs: Array(String),
});

export type Code = Static<typeof Code>;
