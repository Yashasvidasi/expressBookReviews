const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let newarray = users.filter((item)=>{
        return item.username === username;
    })
    return newarray.length===0;
}

const authenticatedUser = (username,password)=>{ 
    let newarray = users.filter((item)=>{
        return item.username === username && item.password === password;
    })
    return newarray.length!==0;
}

regd_users.post("/login", function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
    }
    console.log(users);
    // Authenticate user
    if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign(
        {
          data: password,
        },
        "access",
        { expiresIn: 60 * 60 }
      );
      // Store access token and username in session
      req.session.authorization = {
        accessToken,
        username,
      };
      return res.status(200).send("User successfully logged in");
    } else {
      return res
        .status(208)
        .json({ message: "Invalid Login. Check username and password" });
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const id = req.params.isbn;
  const book = books[id];
  let uname = req.session.authorization['username']; // Access Token
  book.reviews[uname] = req.body.review;
    
  return res.status(300).send(`${book.reviews[uname]}\n by ${uname}\n Review added to ${book.title}`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
const id = req.params.isbn;
  const book = books[id];
  
  let uname = req.session.authorization['username']; // Access Token
  const review = book.reviews[uname];
  if(book.reviews[uname]) delete book.reviews[uname];
  return res.status(300).send(`${review}\n by ${uname}\n Review deleted ${book.title}`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.checkpass = authenticatedUser;
