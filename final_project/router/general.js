const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "Username already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, " "));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let searched_book = books[isbn];
  if (searched_book) {
    res.send(searched_book);
  } else {
    return res.status(404).json({ message: `Unable to find book with ISBN ${isbn}` })
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let author_books = Object.values(books).filter((book) => {
    return book.author === author;
  })

  if (author_books.length > 0) {
    res.send(author_books);
  } else {
    return res.status(404).json({ message: `Unable to find books with author ${author}` })
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let title_books = Object.values(books).filter((book) => {
    return book.title === title;
  })

  if (title_books.length > 0) {
    res.send(title_books);
  } else {
    return res.status(404).json({ message: `Unable to find books with title ${title}` })
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let searched_book = books[isbn];

  if (searched_book) {
    res.send(searched_book.reviews);
  } else {
    return res.status(404).json({ message: `Unable to find book with ISBN ${isbn}` })
  }
});

module.exports.general = public_users;
