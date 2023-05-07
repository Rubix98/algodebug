import { Profile } from "passport";
import { TypeLike } from "../types";

export type profileEssentials = TypeLike<Pick<Profile, "displayName" | "emails" | "photos">>
