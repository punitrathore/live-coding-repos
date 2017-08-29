const db = require('./db/contacts')

const createContact = function(contact){
  return db.createContact(contact)
}

const getContacts = function(){
  return db.getContacts();
}

const getContact = function(contactId){
  return db.getContact(contactId);
}

const deleteContact = function(contactId){
  return db.deleteContact(contactId);
}

const searchForContact = function(searchQuery){
  return db.searchForContact(searchQuery);
}

// functions which manipulate contacts live in this file
const longLastNames = function(contacts) {
  return contacts.filter(contact => {
    return contact.last_name.length > 10
  });
}

module.exports = {
  createContact,
  getContacts,
  getContact,
  deleteContact,
  searchForContact,
  longLastNames
}
