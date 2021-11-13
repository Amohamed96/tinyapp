const {getUserByEmail, emailCheck, generateRandomString} = require("./helpers");
const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cookieSession());

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
};
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  let user_id = req.cookies["user_id"];
  let user = users[user_id];
  res.send("Hello!");
  const templateVars = {user: user};
  res.render("homepage", templateVars);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
///////////////// LOGIN ////////////////////////

app.get("/login", (req, res) => {
  let user_id = req.cookies["user_id"];
  let user = users[user_id];
  if (user_id) {
    res.redirect("/urls");
  }
  const templateVars = { urls: urlDatabase, user: user };
  res.render("login", templateVars);
});
app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email);
  if (user) {
    // console.log("FOUND!")
    // console.log("REQ.BODY.PASSWORD:", req.body.password)
    // console.log("USER.PASSWORD:", user.password)

    if (req.body.password === user.password) {
      res.cookie("user_id", user.id);
      res.redirect("/urls");
    } else {
      res.send("INCORRECT PASSWORD");
    }

  } else {
    res.send("ERROR 403: FORBIDDEN");
  }
});
///////////////// LOGOUT ////////////////////////

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

///////////////// REGISTER ////////////////////////

app.get("/register", (req, res) => {
  let user_id = req.cookies["user_id"];
  let user = users[user_id];
  if (user_id) {
    res.redirect("/urls");
  }
  const templateVars = { urls: urlDatabase, user: user };

  res.render("register", templateVars);
});
app.post("/register", (req, res) => {

  const ID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  // error for registration

  for (let key in users) {
    if (users[key].email === email) {
      res.render("error.ejs");
    }
  }
  console.log(email);
  // add this user to the global users
  users[ID] = {
    id: ID,
    email: email,
    password: password
  };
  console.log(users);
  // set a user ID cookie
  res.cookie("user_id", ID);
  res.redirect("/urls");
});
///////////////// URLS ////////////////////////

app.get("/urls", (req, res) => {
  let user_id = req.cookies["user_id"];
  if (!user_id) {
    res.redirect("/login");
  }
  let user = users[user_id];
  console.log(user);
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  const userUrls = {};
  let longURL = req.body.longURL;
  let shortUrl = generateRandomString();
  let user_id = req.cookies["user_id"];
  userUrls["longURL"] = longURL;
  userUrls["userID"] = user_id;
  urlDatabase[shortUrl] = userUrls;
  // console.log("shortUrl:", shortUrl);
  // console.log("longUrl:", longURL);
  // console.log("user longURL:", userUrls[longURL]);
  // console.log(urlDatabase)
  res.redirect(`/urls/${shortUrl}`);
});
app.get("/urls/new", (req, res) => {
  let user_id = req.cookies["user_id"];
  // let user = users[user_id];
  if (!user_id) {
    return res.redirect("/login");
  }
  const templateVars = { urls: urlDatabase, user: users[req.cookies.user_id] };
  res.render("urls_new", templateVars);

});
///////////////// SHORT URLS ////////////////////////

app.get("/urls/:shortURL", (req, res) => {
  let user_id = req.cookies["user_id"];
  let user = users[user_id];
  let a = req.params.shortURL;
  if (!urlDatabase[a]) {
    res.redirect("/urls");
  }
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[a]["longURL"],  user: user, userID: user_id};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  //TODO: Check if user is logged in, Check if logged in user owns url to be edited or deleted
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});
///////////////// URLS ID ////////////////////////

app.post("/urls/:id", (req, res) => {
  let newURL = req.body.newURL;
  //TODO: Check if user is logged in, Check if logged in user owns url to be edited or deleted
  let user_id = req.cookies["user_id"];
  console.log("req.params.id: ", req.params.id);
  urlDatabase[req.params.id] = {
    longURL: newURL,
    userID: user_id
  };
  res.redirect(`/urls`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

///////////////// TURN SERVER ON////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

