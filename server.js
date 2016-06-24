'use strict';
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const port = process.env.PORT || 3000;
const app = express();

const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENTID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACKURL
}, (accessToken, refreshToken, profile, done) => {
  console.log(`
**accessToken**
${accessToken}

**refreshToken**
${refreshToken}

**profile**
${JSON.stringify(profile, null, 2)}
`);
  return done(null);
});

passport.use(googleStrategy);

app.set('view engine', 'jade');

app.get('/', (req, res) => {
  res.render('root/index');
});

app.get('/signin/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]
}));
app.get('/signin/google/callback', passport.authenticate('google'));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`app start, on port ${port} in ${app.get('env')} mode ${Date().toString()}`);
});
