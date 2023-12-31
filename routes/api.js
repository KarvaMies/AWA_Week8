require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session')

function getUserByUsername(username) {
  return users.find(user => user.username === username)
}

function getUserById(id) {
  return users.find(user => user.id === id)
}

const initializePassport = require('../passport-config');
initializePassport(passport, getUserByUsername, getUserById);

router.use(express.json());

let users = [];

router.use(session({
  secret: "GFHTJK#dfht256774g",
  resave: false,
  saveUninitialized: false
}))

router.use(passport.initialize())
router.use(passport.session())

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/user/register", checkNotAuthenticated, (req, res) => {
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

router.post("/user/login", checkNotAuthenticated, (req, res, next) => {
  console.log("Trying to login");
  passport.authenticate('local', (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.status(401).json({ message: "Invalid username and/or password "});
    }
    req.logIn(user, (err) => {
      if (err) throw err;
      return res.status(200).send("ok")
    })
  })(req, res, next)
});

router.get("/secret", checkAuthenticated, (req, res) => {
  res.status(200).json({ message: "You are logged in so you can see this message" });
})

function checkAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ message: "Please log in to see this page" });
}

function checkNotAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/api")
  }
  return next()
}

module.exports = router;
