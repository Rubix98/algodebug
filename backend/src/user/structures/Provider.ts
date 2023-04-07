import { Union, Literal, Static } from "runtypes";

export const Provider = Union(Literal("google"), Literal("algodebug"));

export type Provider = Static<typeof Provider>;
