const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('./db/user');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.find(username).then(user=>  {
      console.log('!user::1');
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      User.isValidPassword(user, password).then(isValid => {
        console.log('!user::2', isValid);
        if(!isValid) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      })
    })
  }))

passport.serializeUser(function(user, done) {
  console.log('entered serializeUser::');
  done(null, JSON.stringify({username: user.username, age: 30}));
});

passport.deserializeUser(function(user, done) {
  console.log('entered deserializeUser::');
  var parsedUser = JSON.parse(user);
  User.find(parsedUser.username)
    .then(user =>  {
      done(null, user)
    })
});

module.exports = passport
