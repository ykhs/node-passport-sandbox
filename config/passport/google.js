const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../../app/models/user');

module.exports = new GoogleStrategy({
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
