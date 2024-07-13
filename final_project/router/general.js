const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        let data = "";
        Object.keys(books).forEach((element) => {
            if (books[element]) {
                data += `Book-${element}: ${books[element].title} by ${books[element].author}\n Reviews: ${JSON.stringify(books[element].reviews)}\n\n`;
            }
        });
        resolve(data); 
    });

    myPromise.then((data) => {
        return res.status(200).send(data); 
    }).catch((error) => {
        return res.status(500).send("Error retrieving books."); 
    });
});

public_users.get("/isbn/:isbn", function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
      const id = req.params.isbn;
      const string = `Book-${id}: ${books[id].title} by ${books[id].author} \n Reviews: ${JSON.stringify(books[id].reviews)}\n\n`;
      resolve(string);
    });
  
    myPromise
      .then((string) => {
        return res.status(200).send(string);
      })
      .catch((error) => {
        return res.status(500).send("Error retrieving books.");
      });
  });
  
  
  public_users.get("/author/:author", function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
      let newarray = Object.keys(books).filter((element) => {
        return books[element].author == req.params.author;
      });
      let data = "";
      newarray.forEach((element) => {
        if (books[element]) {
          data += `Book-${element}: ${books[element].title} by ${books[element].author} \n Reviews: ${JSON.stringify(books[element].reviews)}\n\n`; 
        }
      });
      resolve(data);
    });
  
    myPromise
      .then((data) => {
        return res.status(200).send(data);
      })
      .catch((error) => {
        return res.status(500).send("Error retrieving book.");
      });
  });


  public_users.get("/title/:title", function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
      let newarray = Object.keys(books).filter((element) => {
        return books[element].title == req.params.title;
      });
      let data = "";
      newarray.forEach((element) => {
        if (books[element]) {
          data += `Book-${element}: ${books[element].title} by ${books[element].author} \n Reviews: ${JSON.stringify(books[element].reviews)}\n\n`;
        }
      });
      resolve(data);
    });
  
    myPromise
      .then((data) => {
        return res.status(200).send(data);
      })
      .catch((error) => {
        return res.status(500).send("Error retrieving book.");
      });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const id = req.params.isbn;
    const data = books.id;
    const string = `Review: ${JSON.stringify(books[id].reviews)}`;
    return res.status(300).send(string);
});

module.exports.general = public_users;
