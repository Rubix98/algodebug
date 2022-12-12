import { Union, Literal, Static } from "runtypes";

export const LoginMethod = Union(Literal("google"));

export type LoginMethod = Static<typeof LoginMethod>;
