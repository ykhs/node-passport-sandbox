'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const port = process.env.PORT || 3000;
const app = express();

require('./config/passport')(app, passport);
require('./config/express')(app, passport);
require('./config/routes')(app);

initDB()
  .once('open', listen);

function initDB() {
  return mongoose.connect(process.env.MONGODB_URL).connection;
}

function listen() {
  app.listen(port, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`app start, on port ${port} in ${app.get('env')} mode ${Date().toString()}`);
  });
}
