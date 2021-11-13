const getUserByEmail = (email, users) => {
  for (key in users) {
    console.log("Key:", key)
    if (users[key].email === email) {
      return users[key]
    }
   }  
   return null
}

const emailCheck = function(email) {
}

const generateRandomString = function() {
  return Math.random().toString(36).slice(7)
}

module.exports = {getUserByEmail, emailCheck, generateRandomString}