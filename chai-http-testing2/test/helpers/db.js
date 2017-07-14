const db = require('../../db');
const QueryFile = require('pg-promise').QueryFile;
const path = require('path');
const fs = require('fs');

function sql(file) {
  const fullPath = path.join(__dirname, file); // generating full path;
  return new QueryFile(fullPath);
}

const seedFiles = {contacts: sql('../seed/contacts.sql'),
                   users: sql('../seed/users.sql'),
                   addresses: sql('../seed/addresses.sql')};

const truncateTables = () => {
  // if (process.env.NODE_ENV == 'production') {
  //   throw new Error(' YOU ARE CRAZY ');
  // }
  // const tables = ['contacts', 'users', 'addresses']

  const contactsFile = fs.readFileSync(__dirname + '/../seed/contacts.sql').toString();

  console.log('contactsFile:', contactsFile);
  return db.none(contactsFile);
  // return Promise.all(tables.map((table) => {
  //   return db.none(`select * from contacts; select first_name from contacts`);
  // }))
}

const seedTables = () => {
  return db.none(seedFiles.contacts, ['bar', 'baz'])
    .then(() => db.none(seedFiles.users))
    .then(() => db.none(seedFiles.addresses));
};

const initDB = () => {
  return truncateTables()
  // return truncateTables().then(() => {
  //   return seedTables()
  // });
};

module.exports = { initDB};
