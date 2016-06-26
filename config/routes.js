const passport = require('passport');

module.exports = function(app) {
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
};
