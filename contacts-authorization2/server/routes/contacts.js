const express = require('express')
const database = require('../../database')
const {renderError, renderUnauthorized} = require('../utils')
const userHasAccess = require('../../authorization/roles');

const router = express.Router()

router.get('/search', (request, response, next) => {
  const query = request.query.q
  database.searchForContact(query)
    .then(function(contacts) {
      if (contacts) return response.render('index', { query, contacts })
      next()
    })
    .catch( error => renderError(error, response, response) )
})


router.get('/new', (request, response) => {
  response.render('new')
})

router.get('/:contactId', (request, response, next) => {
  const contactId = request.params.contactId
  if (!contactId || !/^\d+$/.test(contactId)) return next()
  database.getContact(contactId)
    .then(function(contact) {
      if (contact) return response.render('show', { contact })
      next()
    })
    .catch( error => renderError(error, response, response) )
})

router.post('/', (request, response, next) => {
  const {user} = request
  if(userHasAccess(user, 'createContact')) {
    database.createContact(request.body)
      .then(function(contact) {
        if (contact) return response.redirect(`/contacts/${contact[0].id}`)
        next()
      })
      .catch( error => renderError(error, response, response) )
  } else {
    renderUnauthorized(response)
  }

})


router.get('/:contactId/delete', (request, response, next) => {
  const contactId = request.params.contactId
  database.deleteContact(contactId)
    .then(function(contact) {
      if (contact) return response.redirect('/')
      next()
    })
    .catch( error => renderError(error, response, response) )
})


module.exports = router
