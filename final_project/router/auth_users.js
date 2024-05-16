const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let existing_username = users.filter((user) => {
    return user.username === username
  });
  if (existing_username.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let valid_users = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (valid_users.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  }
  return res.status(401).json({ message: "Invalid login. Please try again" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let review = req.body.review;
  let user = req.session.authorization.username;
  books[isbn]["reviews"][user] = review;
  res.send("Your review has been successfully added");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let user = req.session.authorization.username;
  if(books[isbn]["reviews"][user]) {
    delete books[isbn]["reviews"][user];
    res.send("Your review has been successfully deleted");
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
