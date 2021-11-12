const express = require("express");
const morgan = require("morgan")
const cookieSession = require("cookie-session")
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(morgan("dev"))
// app.use(cookie-session())

const bcrypt = require("bcrypt");
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
    }
    const getUserByEmail = (email) => {
      for (key in users) {
        console.log("Key:", key)
        if (users[key].email === email) {
          return users[key]
        }
       }  
       return null
      }
      const emailCheck = function (email) {
      }
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const accounts = [];
function generateRandomString() {
  return Math.random().toString(36).slice(7)
 }
 
 app.post("/register", (req, res) => {
  // try {
  //   const hashedPassword = bcrypt.hash(req.body.password, 10, (err, hash) => {

  //   }
  //   accounts.push({
  //     id: Date.now().toString(),
  //     email: req.body.email, 
  //     password: hashedPassword
  //   })
  //   res.redirect("/login")
  // } catch {
  //   res.redirect("/register")
  // }
  const ID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  // error for registration
  // for (stuff in users[key])
  // emailCheck(email);
      // res.redirect("/register")
    
  const user = {
    id: ID,
    email: email,
    password: password
  }
  for (key in users) {
    if (users[key].email === email) {
      res.render("error.ejs")
    }
  }
  console.log(users)
  console.log(email)
  // add this user to the global users
  users[ID] = user
  console.log(users)
  // set a user ID cookie
  res.cookie("user_id", ID);
  res.redirect("/urls");
})
app.post("/urls", (req, res) => {
  let longURL = req.body.longURL
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = longURL;
  console.log("shortUrl:", shortUrl);
  console.log("longUrl:", longURL);
  console.log(urlDatabase)
  res.redirect(`/urls/${shortUrl}`)
})
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect(`/urls`)
})
app.post("/urls/:id", (req, res) => {
  newURL = req.body.newURL
  urlDatabase[req.params.id] = newURL;
  res.redirect(`/urls`)
})
app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email);
  if (user) {
    // console.log("FOUND!")
    // console.log("REQ.BODY.PASSWORD:", req.body.password)
    // console.log("USER.PASSWORD:", user.password)

    if (req.body.password === user.password) {
      res.cookie("user_id", user.id);
      res.redirect("/urls")
    } else {
      res.send("INCORRECT PASSWORD")
    }

  } else {
    res.send("ERROR 403: FORBIDDEN")
  }
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect("/urls");
})
app.get("/", (req, res) => {
  let user_id = req.cookies["user_id"]
  let user = users[user_id];
  res.send("Hello!");
  const templateVars = {user: user}
  res.render("homepage", templateVars)
});
app.get("/login", (req, res) => {
  let user_id = req.cookies["user_id"]
  let user = users[user_id];
  const templateVars = { urls: urlDatabase, user: user };
  res.render("login", templateVars)
})
app.get("/register", (req, res) => {
  let user_id = req.cookies["user_id"];
  let user = users[user_id];
  const templateVars = { urls: urlDatabase, user: user };

  res.render("register", templateVars);
})
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  let user_id = req.cookies["user_id"]
  if (!user_id) {
    res.redirect("/login")
  }
  let user = users[user_id];
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  let user_id = req.cookies["uder_id"]
  let user = users[user_id];
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_new", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  let user_id = req.cookies["user_id"]
  let user = users[user_id];
  let a = req.params.shortURL;
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[a], user: user};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

