const GoogleTokenStrategy = require('passport-google-id-token');
const User = require('../../app/models/user');

module.exports = new GoogleTokenStrategy({
  clientID: process.env.GOOGLE_CLIENTID
}, (parsedToken, googleId, done) => {
  User.findOne({'google.id': googleId}).exec()
    .then((user) => {
      if (!user) {
        user = new User({
          google: {id: googleId}
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
