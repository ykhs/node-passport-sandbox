'use strict';
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./app/models/user');

const port = process.env.PORT || 3000;
const app = express();

const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENTID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACKURL
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({'google.id': profile.id}).exec()
    .then((user) => {
      if (!user) {
        user = new User({
          google: profile._json
        });
        return user.save();
      }
      return user;
    })
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({
    url: process.env.MONGODB_URL,
    collection: 'sessions'
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', './app/views');
app.set('view engine', 'jade');

passport.serializeUser((user, fn) => {
  fn(null, user.id);
});
passport.deserializeUser((id, fn) => {
  User.findOne({_id: id}).exec(fn);
});
passport.use(googleStrategy);

app.get('/', (req, res) => {
  res.render('root/index', {
    user: req.user
  });
});
app.get('/signin/google', passport.authenticate('google', {
  failureRedirect: '/signin/failure',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]
}));
app.get('/signin/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/signin/failure'
}));
app.get('/signout', (req, res) => {
  req.logout();
  res.redirect('/');
});

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
