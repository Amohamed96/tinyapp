const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser')
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  return Math.random().toString(36).slice(7)
 }
 
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
  const loginInfo = req.body.username;
  res.cookie("username", loginInfo);
  res.redirect("/urls");
})
app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect("/urls");
})
app.get("/", (req, res) => {
  let user = req.cookies["username"]
  res.send("Hello!");
});
app.get("/login", (req, res) => {
  let user = req.cookies["username"]
  const templateVars = { urls: urlDatabase, username: user };

  res.render("urls_index", templateVars);

  res.json(urlDatabase);

})
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  let user = req.cookies["username"]
  if (!user) {
    res.redirect("/login")
  }
  const templateVars = { urls: urlDatabase, username: user };
  console.log("-----cookies------")
  console.log(req.cookies)
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  let user = req.cookies["username"]
  const templateVars = { urls: urlDatabase, username: user };
  res.render("urls_new", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  let user = req.cookies["username"]
  let a = req.params.shortURL;
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[a], username: user};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let user = req.cookies["username"]
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[a]};

  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

