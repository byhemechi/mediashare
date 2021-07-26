import { port } from "./env";
import setup from "./init";

// Listen on `port` and log to console
setup().then((app) =>
  app.listen(port, () => console.info(`Server Listening on port ${port}`))
);
