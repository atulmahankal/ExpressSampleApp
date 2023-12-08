const express = require('express');
const app = express();
const engine = require('ejs-blocks');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const { dbConnect } = require('./lib/dbConnect');
app.engine('ejs', engine);

// connect to database
(async () => {
  await dbConnect();
})();

// Parse SESSION_LIFETIME_MINUTES from .env as an integer and convert to milliseconds
const sessionLifetimeMinutes = parseInt(process.env.SESSION_LIFETIME_MINUTES, 10);
const sessionLifetimeMilliseconds = sessionLifetimeMinutes * 60 * 1000;

// Set up session
app.use(
  session({
    secret: process.env.APP_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      maxAge: sessionLifetimeMilliseconds,
      secure: false, // Set to true in production if using HTTPS
    },
  })
);

module.exports = app;