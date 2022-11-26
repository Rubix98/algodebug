import { Union, Literal, Static } from 'runtypes';

export const Language = Union(
    Literal("cpp"),
    Literal("cs"),
    Literal("c"),
    Literal("java"),
    Literal("py")
);

export type Language = Static<typeof Language>;
