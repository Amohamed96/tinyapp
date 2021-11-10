const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req, res) => {
  let a = req.params.shortURL;
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[a]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

