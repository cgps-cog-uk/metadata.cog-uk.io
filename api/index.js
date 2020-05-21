const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const ws = require("ws");

const config = require("./utils/config");

const app = express();

app.use(
  bodyParser.json({ limit: "500mb" })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "500mb",
  })
);

app.use(cookieParser());

app.use((req, res, next) => {
  req.config = config;
  next();
});

app.use(
  "/api",
  jwt({
    secret: config.secret,
    getToken(req) {
      if (req.headers.authorization) {
        const [ method, token ] = req.headers.authorization.split(" ");
        if (method === "Bearer") {
          return token;
        }
      }
      else if (req.cookies && req.cookies["auth._token.local"]) {
        const [ method, token ] = req.cookies["auth._token.local"].split(" ");
        if (method === "Bearer") {
          return token;
        }
      }
      return null;
    },
  })
    .unless({ path: [ "/api/auth/login" ] }),
  require("./routes")
);

const wss = new ws.Server({ server: app });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);

module.exports = app;
