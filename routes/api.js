require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

router.use(express.json());

let users = [];


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/user/register", (req, res) => {
  console.log("Trying to add new user");
  const { username, password } = req.body;

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already in use.' });
  } else {
    const id = Date.now();
    bcrypt.genSalt(10, (err, salt) => {
      console.log("gensalt");
      if (err) throw err;
      bcrypt.hash(password, salt, (err, hash) => {
        console.log("hash");
        if (err) throw err;
        let user = {
          "id": id,
          "username": username,
          "password": hash
        }
        users.push(user);
        console.log("user added:");
        console.log(user);
        res.json(user);
      })
    })
    
  }

});

router.get("/user/list", (req, res) => {
  console.log("User list:")
  console.log(users);
  res.json(users);
})

router.post("/user/login", (req, res) => {
  console.log("Trying to login");
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid username and/or password "});
  }
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) throw err;
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username and/or password "});
    }
    const jwtPayload = {
      id: user.id,
      username: user.username
    }
    jwt.sign(jwtPayload, process.env.SECRET,
      {
        expiresIn: 120
      },
      (err, token) => {

        res.status(200).send("ok")
      }
    );
  })
});

module.exports = router;
