import { Profile } from "passport";
import { TypeLike } from "../shared/types";

export type profileEssentials = TypeLike<Pick<Profile, "displayName" | "emails" | "photos">>;
