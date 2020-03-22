const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const MongoSessionStore = require("connect-mongo")(session);
const userAccounts = require("cgps-user-accounts/src");

const config = require("./utils/config");
const userStore = require("./utils/user-store");
const accessTokenMiddleware = require("./access-token-middleware");
const epicollectApi = require("./utils/epicollect");

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

// required for passport
app.use(cookieParser());

if (process.env.npm_lifecycle_script !== "nuxt build") {
  app.use(
    session({
      secret: config.sessionSecret,
      store: new MongoSessionStore({ url: config.mongodb.url }),
      resave: true,
      saveUninitialized: true,
    })
  );

  mongoose.connect(
    config.mongodb.url,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

  mongoose.connection.on(
    "error",
    (error) => {
      console.error(error);
      process.exit(1);
    }
  );
}

// configure user accounts
userAccounts(app, {
  userStore,
  url: config.passport.url,
  authPath: "/auth",
  successRedirect: `${config.passport.url}`,
  failureRedirect: `${config.passport.url}/login`,
  logoutRedirect: config.passport.url,
  logoutPath: "/logout",
  strategies: config.passport.strategies,
  redirectToReferrer: false,
});

app.use(accessTokenMiddleware);

app.use((req, res, next) => {
  req.config = config;
  req.getProjectDefinition = () => {
    const project = req.user.getProject();
    return epicollectApi.getProjectDefinition(project);
  }
  next();
});

app.use("/api", require("./routes"));

module.exports = app;
