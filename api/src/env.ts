import dotenv from "dotenv";

dotenv.config();
// Set the server port via `PORT` env variable, falling back to `8080`
export const port = parseInt(process.env?.PORT) || 8080;
export const hostname = process.env?.HOSTNAME ?? "localhost";
