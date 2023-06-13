const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

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

module.exports = router;
