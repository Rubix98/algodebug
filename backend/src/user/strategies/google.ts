import passport from "passport";
import Strategy from "passport-google-oauth20";

import { processUser } from "../service";

export function initializeGoogle() {
    const GoogleStrategy = Strategy.Strategy;

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
                userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
                passReqToCallback: true,
            },
            async (_request, _accessToken, _refreshToken, profile, done: (arg0: null, arg1: any) => any) => {
                const user = await processUser("google", profile);
                if (user == null) return done(null, false);
                return done(null, user);
            }
        )
    );
}
