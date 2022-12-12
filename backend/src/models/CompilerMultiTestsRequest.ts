import { Language } from "../structures/Language";
import { Static, Record, String, Array } from "runtypes";

export const CompilerMultiTestsRequest = Record({
    code: String,
    inputs: Array(String),
    language: Language,
});

export type CompilerMultiTestsRequest = Static<typeof CompilerMultiTestsRequest>;

export const sanitize = (c: CompilerMultiTestsRequest) => {
    return {
        code: c.code,
        language: c.language,
        inputs: c.inputs,
    } as CompilerMultiTestsRequest;
};
