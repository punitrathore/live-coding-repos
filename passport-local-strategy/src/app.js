var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var User = require('./db/user');
var authInit = require('./config/auth');
var authRoutes = require('./routes/auth');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var app = express();

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// parsing cookiers from the request
app.use(cookieParser())

app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

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

app.route('/login')
  .get( (req, res) => {
    console.log('entered get', __dirname + '/views/login.html');
    res.sendFile(__dirname + '/views/login.html');
  })
  .post(passport.authenticate('local', { successRedirect: '/dashboard',
                                         failureRedirect: '/login',
                                         failureFlash: true }))

app.route('/signup')
  .get( (req, res) => {
    res.sendFile(__dirname + '/views/signup.html')
  })
  .post( (req, res) => {
    var {username, password} = req.body
    User.create(username, password).then(() => {
      res.send('created the user')
    });
  })

app.use((req, res, next) => {
  console.log('req.session::', req.session);
  if(req.user) {
    next();
  } else {
    res.redirect('/login');
  }
});

// route for user logout
app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});


//app.use('/', authRoutes(passport))

app.get('/users', (req, res) => {
  res.json(User.all())
});

// route for user's dashboard
app.get('/dashboard', (req, res, next) => {
  console.log('req.cookies::', req.cookies);
  res.send('this is the dashboard');
});


var PORT = 3000

app.listen(PORT, () => console.log(`App started on port ${PORT}`));
