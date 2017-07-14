const express = require('express')
const router = express.Router()
const User = require('../../db/user');

module.exports = passport => {
  router.route('/login')
    .get( (req, res) => {
      console.log('entered /login', __dirname + '/../../views/login.html');
      res.sendFile(__dirname + '/../../views/login.html');
    })
    .post(passport.authenticate('local', { successRedirect: '/dashboard',
                                           failureRedirect: '/login',
                                           failureFlash: true }))

  router.route('/signup')
    .get( (req, res) => {
      res.sendFile(__dirname + '/../../views/signup.html')
    })
    .post( (req, res) => {
      var {username, password} = req.body
      User.create(username, password).then(() => {
        res.send('created the user')
      });
    })

  router.use((req, res, next) => {
    console.log('req.session::', req.session);
    if(req.user) {
      next();
    } else {
      res.redirect('/login');
    }
  });

  return router
}
