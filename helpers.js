
const getUserByEmail = function(email, users) {
  for (const user in users) {
    if (email === users[user].email) {
      return user;
    }
  }
};
const checkUrlExists = function(shortURL, urlDatabase) {
  for (const url in urlDatabase) {
    if (shortURL === url) {
      return shortURL;
    }
  }
};
const emailCheck = function(email, users) {
  for (let key in users) {
    if (users[key].email === email) {
      return email;
    }
  }
};

const generateRandomString = function() {
  return Math.random().toString(36).slice(7);
};

const getUserUrls = function(id, database) {
  let usersURLS = {};
  for (const url in database) {
    if (database[url].userID === id) {
      usersURLS[url] = database[url].longURL;
    }
  }
  return usersURLS;
};
module.exports = {getUserByEmail, emailCheck, generateRandomString, getUserUrls, checkUrlExists};