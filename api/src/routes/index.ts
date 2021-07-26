import { RequestHandler } from "express";

// Nothing really goes on the index route, just send a simple "hello" message
const IndexRoute: RequestHandler = async (req, res) => {
  res.header("Content-Type", "text/plain");
  res.send("hi");
};

export default IndexRoute;
