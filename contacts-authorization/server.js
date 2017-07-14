const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database')
const app = express()
const {renderError} = require('./server/utils')
const contacts = require('./server/routes/contacts')
const authenticationRoutes = require('./server/routes/authentication')
const passport = require('./authentication')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const User = require('./db/user');

app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use((request, response, next) => {
  response.locals.query = ''
  next()
})


app.get('/users', (req, res) => {
  res.json(User.all())
});


app.route('/login')
  .get( (req, res) => {
    console.log('entered /login', __dirname + '/views/login.html');
    res.sendFile(__dirname + '/views/login.html');
  })
  .post(passport.authenticate('local', { successRedirect: '/',
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
  if(req.user) {
    next();
  } else {
    res.redirect('/login');
  }
});



app.get('/', (request, response) => {
  const contacts = database.getContacts()
  .then((contacts) => {response.render('index', { contacts })})
  .catch( err => console.log('err', err) )
})

app.use('/contacts', contacts)

app.use((request, response) => {
  response.render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
