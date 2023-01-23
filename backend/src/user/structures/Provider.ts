import { Union, Literal, Static } from "runtypes";

export const Provider = Union(Literal("google"));

export type Provider = Static<typeof Provider>;
