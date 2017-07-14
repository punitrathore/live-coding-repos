const bcrypt = require('bcrypt');
const saltRounds = 10;

var users = {
  "foo":{"username":"foo","password":"$2a$10$EjBbGQWz2MJSFZEnECPnJeghnrDT30uWDTFZfI9UNaLImc/Vn/44u", role: 'admin'},
  "minion":{"username":"minion","password":"$2a$10$nIe9dF6rodXvdqTmkuhEYesfrE8/DN8.kd78nM.bo2nbYTsD8qSTG", role: 'viewer'}
}

const saltedPassword = function(username, plainTxtPassword, salt) {
  return bcrypt.hash(plainTxtPassword, salt).then(hash => {
    return users[username].password = hash
  });
}

const isValidPassword = function(user, password) {
  console.log('user::', user)
  var saltedPassword = user.password
  return bcrypt.compare(password, saltedPassword).then(function(res) {
    return res
  });
}

const find = function(username) {
  return new Promise((resolve, reject) => {
    resolve(users[username])
  })
}

const create = function(username, password) {
  users[username] = {username}
  return saltedPassword(username, password, saltRounds).then(() => {
    console.log(`created the password for the user ${username}`)});
}

const all = function() {
  return users
};

module.exports = {
  isValidPassword,
  find,
  create,
  all
};
