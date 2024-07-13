const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const checkpass = require('./router/auth_users.js').checkpass;
const isValid = require('./router/auth_users.js').isValid;
const users = require('./router/auth_users.js').users;

const app = express();

app.use(express.json());

app.use(
    "/customer",
    session({
      secret: "fingerprint_customer",
      resave: true,
      saveUninitialized: true,
    })
  );

  app.post("/register", function (req, res){
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(404).json({ message: "username or password missing" });
    }
    if(!isValid(username)){
        return res.status(404).json({ message: "UserName Exists" });
    }
    users.push({"username":username, "password":password});
    console.log(users);
    return res.status(300).json({ message: "User added Successfully" });
  })

  app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token
        
        // Verify JWT token for user authentication
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                console.log(">>>>",user);
                req.user = user; // Set authenticated user data on the request object
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" }); // Return error if token verification fails
            }
        });
        
        // Return error if no access token is found in the session
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }

  });
  
 
  
  const PORT = 5000;
  
  app.use("/customer", customer_routes);
  app.use("/", genl_routes);
  
  app.listen(PORT, () => console.log("Server is running localhost:5000"));
  
