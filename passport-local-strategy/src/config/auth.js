var User = require('../db/user');
var LocalStrategy = require('passport-local').Strategy;

function initialize(passport) {
  //Passport config
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.find(username).then(user=>  {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!User.isValidPassword(user, password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, JSON.stringify({username: user.username, age: 30}));
  });

  passport.deserializeUser(function(user, done) {
    var parsedUser = JSON.parse(user);
    User.find(parsedUser.username)
      .then(user =>  {
        done(null, user)
      })
  });
}

module.exports = initialize

