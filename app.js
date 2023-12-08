const express = require('express');
const app = express();

const { dbConnect } = require('./lib/dbConnect');

// connect to database
(async () => {
  await dbConnect();
})();

module.exports = app;