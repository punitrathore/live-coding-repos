const router = require('express').Router();
const contactsRoutes = require('./contacts')
const contacts = require('../../models/contacts');

router.get('/', (request, response) => {
  contacts.getContacts()
    .then((contacts) => {response.render('index', { contacts })})
    .catch( err => console.log('err', err) )
})

router.use('/contacts', contactsRoutes); // /contacts/search

module.exports = router;
