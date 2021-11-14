const {getUserByEmail, emailCheck, generateRandomString, getUserUrls, checkUrlExists} = require("./helpers");
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
app.use(cookieSession({
  name: 'session',
  keys: ['lknt42fnoh90hn2hf90w8fhofnwe0'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

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

app.get('/', (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
    return;
  }
  if (req.session.user_id) {
    res.redirect('/urls');
    return;
  }
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
///////////////// LOGIN ////////////////////////

app.get("/login", (req, res) => {
  let user = users[req.session.user_id];
  if (user) {
    res.redirect("/urls");
  } else {
    const templateVars = { urls: urlDatabase, user: user };
    res.render("login", templateVars);
  }
});
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!emailCheck(email, users)) { // Tells user if their email is not found
    res.status(403).send("USER NOT FOUND!");
    return;
  }
  const user_id = getUserByEmail(email, users);
  const passwords = bcrypt.compareSync(password, users[user_id].password);
  if (!(users[user_id].password && passwords)) { 
    res.status(403).send("INCORRECT EMAIL OR PASSWORD!");
  } else { 
    req.session.user_id = user_id; 
    res.redirect('/urls');

  }
});
///////////////// LOGOUT //////////////////////////

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

///////////////// REGISTER ////////////////////////

app.get("/register", (req, res) => {
  let user = users[req.session.user_id];
  if (req.session.user_id) {
    res.redirect("/urls");
  }
  const templateVars = { urls: urlDatabase, user: users[req.session.user_id] };

  res.render("register", templateVars);
});
app.post("/register", (req, res) => {

  const ID = generateRandomString();
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  // error for registration
  /////////////////////////////////// EMAIL CHECK
  emailCheck(email, users);
  if (getUserByEmail(email, users)) { //If the email is already taken
    res.status(400).send("EMAIL EXISTS!");
  } else if (email === '' || password === '') {
    res.status(400).send("ENTER AN EMAIL OR PASSWORD!");
  } else { //else everything is fine. User can be registered
    users[ID] = { id: ID, email: req.body.email, password: hashedPassword };
    req.session.user_id = ID;
    res.redirect('/urls');
  }
});

///////////////// URLS ////////////////////////

app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
    return;
  }
  let user = users[req.session.user_id];
  if (!user) {
    req.session = null;
    res.redirect("/login");
    return;
  }
  const templateVars = { urls: getUserUrls(req.session.user_id, urlDatabase), user: user };
  res.render("urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  const userUrls = {};
  let longURL = req.body.longURL;
  let shortUrl = generateRandomString();
  userUrls["longURL"] = longURL;
  userUrls["userID"] = req.session.user_id;
  urlDatabase[shortUrl] = userUrls;
  res.redirect(`/urls/${shortUrl}`);
});
app.get("/urls/new", (req, res) => {
  // let user = users[req.session.user_id];
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  const templateVars = {user: users[req.session.user_id]};
  res.render("urls_new", templateVars);

});
///////////////// SHORT URLS ////////////////////////

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const ID = urlDatabase[shortURL];
  if (!shortURL) {
    res.status(404).send("ACCESS DENIED!");
  } else if (!req.session.user_id) {
    res.status(403).send("PLEASE LOGIN!");
    return;
  }
  const longURL = urlDatabase[shortURL].longURL;
  const userURLs = getUserUrls(req.session.user_id, urlDatabase);
  const userKeys = Object.keys(userURLs);
  if (userKeys.length === 0) {
    res.status(403).send("ACCESS DENIED!");
  } else if (!(userKeys.includes(ID) || userKeys.includes(ID) + '?')) {
    res.status(403).send("ACCESS DENIED!");
  } else {
    const templateVars = { longURL, shortURL, users, userID: ID, user: users[req.session.user_id]};
    res.render('urls_show', templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const a = req.params.shortURL;
  if (!checkUrlExists(a, urlDatabase)) {
    res.status(404).send("SITE DOES NOT EXIST");
  } else {
    const longURL = urlDatabase[a].longURL;
    res.redirect(`${longURL}`);
  }
});
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (req.session.user_id === undefined || req.session.user_id === null) {
    res.status(404).send("ERROR: YOU ARE NOT LOGGED IN AS THIS USER!");
    return;
  }
  const userUrls = getUserUrls(req.session.user_id, urlDatabase);
  if (userUrls[shortURL] !== undefined || userUrls[shortURL] !== null) {
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls`);
  } else {
    res.send("YOU CAN NOT DELETE THIS URL!");
  }
});
///////////////// URLS ID ////////////////////////

///////////////// EDIT URL ///////////////////////
app.post("/urls/:id", (req, res) => {
  let newURL = req.body.newURL;
  //TODO: Check if user is logged in, Check if logged in user owns url to be edited or deleted
  const user = users[req.session.user_id];
  const shortURL = req.params.id;
  if (!user) {
    res.status(404).send("ERROR: YOU ARE NOT LOGGED IN!");
    return;
  } else if (!(shortURL in getUserUrls(user.id, urlDatabase))) {
    res.status(404).send("ERROR: YOU ARE NOT LOGGED IN AS THIS USER!");
  } else if (shortURL in getUserUrls(user.id, urlDatabase)) {
    urlDatabase[shortURL].longURL = newURL;
    res.redirect("/urls");
  }
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

///////////////// TURN SERVER ON////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

