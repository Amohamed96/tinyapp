const assert = require('chai').assert;
const { getUserByEmail } = require('../helpers');

const testUsers = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail('user@example.com', testUsers);
    const expectedOutput = 'userRandomID';
    assert.strictEqual(user, expectedOutput);
  });
  it('should return non existant email as undefined', function() {
    const user = getUserByEmail('user5@example.com', testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});