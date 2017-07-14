var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var User = require('./db/user');

var app = express();

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// parsing cookiers from the request
app.use(cookieParser())


// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: 'foobarbaz123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

app.get('/users', (req, res) => {
  res.json(User.all())
});


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  console.log('req.cookies::', req.cookies);
  if (req.cookies && req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});



// route for Home-Page
// app.get('/', sessionChecker, (req, res) => {
//     res.redirect('/login');
// });


// app.use('/users', users);

// app.use(sessionChecker);

// app.use('/todo', todo);
// app.user('/profile', profile);


// route for user Login
app.route('/login')
    .get( (req, res) => {
        res.sendFile(__dirname + '/views/login.html');
    })
    .post((req, res) => {
        var {username, password} = req.body

        User.find(username).then(function (user) {
          console.log('user::', user);
          if (!user) {
            res.redirect('/login');
          } else {
            User.isValidPassword(user, password)
              .then(isValid => {
                if(!isValid) {
                  res.redirect('/login');
                } else {
                  req.session.user = user;
                  res.redirect('/dashboard');
                }
              })
          }
        }) .catch(error => {
          console.error(error);
        });
    });

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


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (!(req.session.user && req.cookies.user_sid)) {
    res.redirect('/login');
  } else {
    next();
  }
};

app.use(sessionChecker);

app.get('/dashboard', (req, res, next) => {
  console.log('SOMEONE CAME TO THE DASHBORD!!');
  next();
});

// route for user's dashboard
app.get('/dashboard', (req, res, next) => {
  console.log('dashboard', req.session.user);
  res.send('this is the dashboard')
  next();
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

var PORT = 3000

app.listen(PORT, () => console.log(`App started on port ${PORT}`));
