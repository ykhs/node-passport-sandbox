'use strict';
const express = require('express');
const passport = require('passport');

const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'jade');

app.get('/', (req, res, next) => {
  res.render('root/index');
});

app.listen(port, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`app start, on port ${port} in ${app.get('env')} mode ${Date().toString()}`);
});
