const expect = require('chai').expect
const dbHelper = require('../helpers/db')

describe('demo', () => {
  beforeEach('reset the DB', () => {
    return dbHelper.initDB()
  });

  it('should work', () => {
    expect({}).to.be.equal({a: 1});
    // creating a contact
    // read the contact
    // expect something to eql something
    // return somePromise.then(data => {
    //   expect(data).to.be.equal({a: 1});
    // })
  });

  it('should work', () => {
    // creating a contact
    // read the contact
    // expect something to eql something
    expect(true).to.equal(false);
  });

});
