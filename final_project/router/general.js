const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  //console.log(req.body);
  if (!username || !password) { return res.status(403).json({ message: "Username And Password Are Required" }) }
  if (isValid(username)) { return res.status(404).json({ message: "Username Already Exists!!" }); }
  users.push({ username: username, password: password })
  //return res.status(200).json(users);
  return res.status(200).json({ message: "User Registered Succesfully!!" })
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  const book_arr = Object.entries(books);
  if (book_arr.length === 0) { return res.status(404).json({ message: "No Book Found!!" }); }
  // res.setHeader('Content-Type', 'application/json');
  return res.status(200).send(JSON.stringify(books, null, 2));

  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (!books[isbn]) { return res.status(404).json({ message: "No Book(s) Found!!" }); }
  return res.status(200).json({ [isbn]: books[isbn] });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author_name = req.params.author;
  const find_author = Object.values(books).filter((item) => {
    return item.author === author_name;
  });

  if (find_author.length === 0) { return res.status(404).json({ message: "No Book(s) Found!!" }); }
  //res.setHeader('Content-Type', 'application/json');
  return res.send(JSON.stringify(find_author, null, 2));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const name_title = req.params.title;
  const find_title = Object.values(books).filter(item => item.title === name_title);
  if (find_title.length === 0) { return res.status(404).json({ message: "No Book(s) Found!!" }); }
  return res.send(JSON.stringify(find_title, null, 2));
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  if (!books[isbn]) { return res.status(404).json({ message: "No Book(s) Found!!" }) }
  const reviews = books[isbn].reviews;
  if (Object.keys(reviews).length === 0) { return res.status(404).json({ message: "No reviews found for this book." }); }
  return res.status(200).json(reviews);
});



const getAllBooks = async () => {

  const response = await axios.get("http://localhost:5000/");
  return response.data;

}
const getbooksbyISBN = async (isbn) => {

  const response = await axios.get("http://localhost:5000/isbn/" + isbn);

  return response.data;

}

const getbooksbyauthor = async (author) => {

  const response = await axios.get("http://localhost:5000/author/" + author);

  return response.data;

}

const getbooksbytitle = async (title) => {

  const response = await axios.get("http://localhost:5000/title/" + title);

  return response.data;

}

public_users.get('/fetch-books-all', async (req, res) => {
  getAllBooks().then((data) => { res.send(data); }).catch(err => res.send(err.response.data));

})


public_users.get('/fetch-books-isbn/:isbn', (req, res) => {
  //  let data;
  const { isbn } = req.params;
  getbooksbyISBN(isbn).then((data) => { res.send(data); }).catch(err => res.send(err.response.data));


})


public_users.get('/fetch-books-author/:author', (req, res) => {

  const { author } = req.params;
  getbooksbyauthor(author).then((data) => { res.send(data); }).catch(err => res.send(err.response.data));

})


public_users.get('/fetch-books-title/:title', async (req, res) => {
  const { title } = req.params;
  console.log(title);
  getbooksbytitle(title).then((data) => { res.send(data); }).catch(err => res.send(err.response.data));

})



module.exports.general = public_users;
//module.exports.asyncApi = { getAllBooks, getbooksbyISBN, getbooksbyauthor, getbooksbytitle }
