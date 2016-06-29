const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = function(app, passport) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
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
};
