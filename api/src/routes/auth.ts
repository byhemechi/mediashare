import { Express, Request, RequestHandler } from "express";
import { db, sql } from "../client";
import { hostname, port } from "../env";
import axios from "axios";

// TODO: Proper logged in check
export const isLoggedIn = async (req: Request): Promise<boolean> => {
  if (!("auth" in (req.cookies ?? {}))) return false;
  const user = await db.token.findFirst({
    where: { token: req.cookies.auth.toString() },
  });
  return user != null;
  // return false
};

export const requireLogin: RequestHandler = async (req, res, next) => {
  if (await isLoggedIn(req)) next();
  res.redirect("/login");
};

const initAuth = async (app: Express) => {
  if (!process.env.TWITCH_CLIENT) throw "Missing Twitch Client ID";
  if (!process.env.TWITCH_SECRET) throw "Missing Twitch Secret";

  app.get("/login", async (req, res) => {
    // If already logged
    if (await isLoggedIn(req)) return res.redirect("/dash");

    const params = new URLSearchParams();
    params.set("client_id", process.env.TWITCH_CLIENT);
    params.set(
      "redirect_uri",
      `http${hostname == "localhost" ? "" : "s"}://${hostname}/oauth/callback`
    );
    params.set("response_type", "code");
    params.set("scope", "channel:read:redemptions");

    res.redirect(`https://id.twitch.tv/oauth2/authorize?${params.toString()}`);
  });

  app.get("/oauth/callback", async (req, res) => {
    // Check if the code is valid on the surface level
    if (req.query.code?.toString().length != 30) {
      res.status(400);
      res.end("Invalid oauth verification code");
    }

    // Get an access token

    // Construct URL parameters
    const params = new URLSearchParams();
    params.set("client_id", process.env.TWITCH_CLIENT);
    params.set("client_secret", process.env.TWITCH_SECRET);
    params.set("code", req.query.code.toString());
    params.set("grant_type", "authorization_code");
    params.set(
      "redirect_uri",
      `http${hostname == "localhost" ? "" : "s"}://${hostname}/`
    );

    try {
      const token = await axios.post(
        `https://id.twitch.tv/oauth2/token?${params}`
      );
      const user = await axios.get(
        `https://api.twitch.tv/helix/users?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token.data["access_token"]}`,
            "Client-Id": process.env.TWITCH_CLIENT,
          },
        }
      );

      const twitchId = user.data.data[0].id.toString();

      const DBUser =
        (await db.user.findFirst({
          where: { twitch_id: { equals: twitchId } },
        })) ?? (await db.user.create({ data: { twitch_id: twitchId } }));

      const newToken = await db.token.create({
        data: {
          User: { connect: { id: DBUser.id } },
          twitch_access: token.data["access_token"],
          twitch_refresh: token.data["refresh_token"],
        },
      });

      res.cookie("auth", newToken.token);
      res.redirect("/dash");
    } catch (err) {
      res.status(500).end("error");
      console.error(err);
    }
  });
};

export default initAuth;
