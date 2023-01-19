import passport from "passport";
import Strategy from "passport-google-oauth20";
import { getCollections } from "../app";
import { User } from "./model";
import { Provider } from "./structures/Provider";

type validUserOrError = [true, User] | [false, unknown];

export function initializePassport() {
    const GoogleStrategy = Strategy.Strategy;

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                callbackURL: "http://localhost:8080/auth/google/callback",
                userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
                passReqToCallback: true,
            },
            async (_request, _accessToken, _refreshToken, profile, done: (arg0: null, arg1: any) => any) => {
                let user = await getUserById(profile.id, "google");

                if (user == null) {
                    const u = {
                        _id: profile.id,
                        provider: "google",
                        username: profile.displayName,
                    } as User;

                    const [isOk, data] = validateUser(u);

                    if (!isOk) {
                        return done(null, false);
                    }

                    try {
                        await saveUser(data);
                        user = data;
                    } catch (error) {
                        return done(null, false);
                    }
                }

                return done(null, user);
            }
        )
    );

    passport.serializeUser((user, done: (arg0: null, arg1: any) => any) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done: (arg0: null, arg1: any) => any) => {
        return done(null, user);
    });
}

const sanitizeUser = (u: User) => {
    const user = {
        _id: u._id,
        provider: u.provider,
        username: u.username,
    } as User;

    return user;
};

export const validateUser = (req: unknown): validUserOrError => {
    try {
        return [true, sanitizeUser(User.check(req))];
    } catch (error) {
        return [false, error];
    }
};

const getUserById = async (id: string, provider: Provider) => {
    const { users } = getCollections();
    const user = await users.findOne({ _id: id, provider: provider });
    return user;
};

const saveUser = async (user: User) => {
    const { users } = getCollections();
    await users.insertOne(user);
};
