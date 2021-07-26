
import IndexRoute from "./routes";
import initAuth, { isLoggedIn } from "./routes/auth";
import { hostname, port } from "./env";
import express from "express";
import cookieParser from 'cookie-parser';

// Set up express
const setup = async () => {
  const app = express();

  app.use(cookieParser());

  // Simple homepage route
  app.get("/", IndexRoute);

  app.get('/dash', async (req, res) => {res.json({isLoggedIn: await isLoggedIn(req), cookies: req.cookies})})

  // Authentication
  await initAuth(app);

  return app;
};

export default setup;