const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return users.find(item => item.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.

  return users.find((item) => item.username === username && item.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username && !password) { return res.status(404).json({ message: "Enter Username & Password" }); }
  if (!authenticatedUser(username, password)) { return res.status(401).json({ message: "Invalid Credentials" }); }
  const payload = { sub: password }

  const accessToken = jwt.sign(payload, "access", { expiresIn: 60 * 60 });

  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "You Are Logged In!!" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //console.log(req.session.authorization);
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.session.authorization["username"];
  if (!review) { return res.status(400).json({ message: "Review is Missing in Query Params!!" }) }
  if (!books[isbn]) { return res.status(404).json({ message: "No Book(s) Found!!" }); }
  books[isbn].reviews[[username]] = review;
  return res.status(200).json({ message: "Review Added Successfully!!" });

});
//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  //console.log(req.session.authorization);
  const { isbn } = req.params;

  const username = req.session.authorization["username"];

  if (!books[isbn]) { return res.status(404).json({ message: "No Book(s) Found!!" }); }

  if (!books[isbn].reviews[username]) {
    return res.status(400).json({
      message: "No review found for the specified user."
    });
  }
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review Deleted Successfully!!" })
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
