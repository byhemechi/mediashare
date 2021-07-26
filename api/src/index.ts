import express from "express";
import IndexRoute from "./routes";
import initAuth from "./routes/auth";
import { hostname, port } from "./env";


const app = express();

// Simple homepage route
app.get("/", IndexRoute);

// Authentication
initAuth(app);

// Listen on `port` and log to console
app.listen(port, () => console.info(`Server Listening on port ${port}`));
