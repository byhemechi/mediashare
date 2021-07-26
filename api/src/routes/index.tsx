import { RequestHandler } from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";

// Nothing really goes on the index route, just send a simple "hello" message
const IndexRoute: RequestHandler = async (req, res) => {
  res.header("Content-Type", "text/html");
  res.end(
    `<!doctype html>` +
      ReactDOMServer.renderToStaticMarkup(
        <html>
          <head>
            <style>
              {`html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              font-family: ui-system, system-ui, sans-serif;
            }
            
            body {
              display: flex;
              align-items: center;
              flex-direction: column;
              justify-content: center;
            }
            
            h1 {
              font-weight: normal
            }

            :link, :visited {
              color: #00aac4;
              text-decoration: none;
            }

            :link:hover, :visited:hover {
              text-decoration: underline;
            }
            @media (prefers-color-scheme: dark) {
              body {
                background: #222;
                color: #eee;
              }
            }
            `.replace(/\n/g, '').replace(/ +/g, ' ')}

            
            </style>
          </head>
          <body>
            <h1>This is an API domain</h1>
            <p>
              If you're seeing this, you've gone to the API route of{" "}
              <a href="https://github.com/byhemechi/mediashare">Mediashare</a>.
            </p>
            <p>
              If you're a user, just head back. There's pretty much nothing here for you.
            </p>
          </body>
        </html>
      )
  );
};

export default IndexRoute;
