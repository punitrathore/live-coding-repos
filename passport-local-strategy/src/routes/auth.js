var router = require('express').Router()
var User = require('../db/user');

module.exports = function(passport){
  router.route('/login')
    .get( (req, res) => {
      console.log('entered get', __dirname + '/../views/login.html');
      res.sendFile(__dirname + './../views/login.html');
    })
    .post(passport.authenticate('local', { successRedirect: '/dashboard',
                                           failureRedirect: '/login',
                                           failureFlash: true }))

  router.route('/signup')
    .get( (req, res) => {
      res.sendFile(__dirname + '/../views/signup.html')
    })
    .post( (req, res) => {
      var {username, password} = req.body
      User.create(username, password).then(() => {
        res.send('created the user')
      });
    })

  // route for user logout
  router.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });

  return router
};


