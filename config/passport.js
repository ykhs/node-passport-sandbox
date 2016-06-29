const google = require('./passport/google');
const googleIdToken = require('./passport/google_id_token');
const User = require('../app/models/user');

module.exports = function(app, passport) {
  passport.serializeUser((user, fn) => {
    fn(null, user.id);
  });
  passport.deserializeUser((id, fn) => {
    User.findOne({_id: id}).exec(fn);
  });
  passport.use(google);
  passport.use(googleIdToken);
};
