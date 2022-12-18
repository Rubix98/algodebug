// integration with google or similar

import passport from "passport";
import Strategy from "passport-google-oauth20";

export function initializePassport() {
  const GoogleStrategy = Strategy.Strategy;

  passport.use(new GoogleStrategy({
      clientID:     process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:8080/auth/google/callback",
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      passReqToCallback   : true,
    },
    (request: any, accessToken: any, refreshToken: any, profile: any, done: (arg0: null, arg1: any) => any) => {
      // Tutaj jeszcze trzeba dorobić zapisywanie użytkownika w bazie danych
      return done(null, profile);
    }
  ));
  
  passport.serializeUser((user: any, done: (arg0: null, arg1: any) => any) => {
    return done(null, user);
  })
  
  passport.deserializeUser((user: any, done: (arg0: null, arg1: any) => any) => {
    return done(null, user);
  })
}