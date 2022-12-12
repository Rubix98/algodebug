import { Static, Record, String } from "runtypes";

export const TestCase = Record({
    input: String,
});

export type TestCase = Static<typeof TestCase>;

export const sanitize = (t: TestCase) => {
    return {
        input: t.input,
    } as TestCase;
};
