import { Static, Record, Number, String } from "runtypes";

export const TestCase = Record({
    id: Number,
    input: String,
});

export type TestCase = Static<typeof TestCase>;

export const sanitizeTestCase = (t: TestCase) => {
    return {
        id: t.id,
        input: t.input,
    } as TestCase;
};
