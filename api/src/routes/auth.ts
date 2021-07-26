import { Express } from "express";
import passport from "passport";
import OAuth2Strategy from "passport-oauth2";
import { hostname, port } from "../env";

const initAuth = (app: Express) => {
  if (!process.env.TWITCH_CLIENT) throw "Missing Twitch Client ID";
  if (!process.env.TWITCH_SECRET) throw "Missing Twitch Secret";

  passport.use(
    new OAuth2Strategy(
      {
        authorizationURL: "https://id.twitch.tv/oauth2/authorize",
        tokenURL: "https://id.twitch.tv/oauth2/token",
        clientID: process.env.TWITCH_CLIENT,
        clientSecret: process.env.TWITCH_SECRET,
        callbackURL: `https://${hostname}${!!port ? `:${port}` : ""}/`,
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOrCreate({ twitchId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    )
  );

  app.get("/auth/twitch", passport.authenticate("twitch"));
  app.get(
    "/auth/twitch/callback",
    passport.authenticate("twitch", { failureRedirect: "/" }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect("/");
    }
  );
};

export default initAuth;
