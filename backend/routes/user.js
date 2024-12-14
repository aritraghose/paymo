const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const config = require("../config");
const {User, Account} = require("../db");

const router = express.Router();

const signupBody = zod.object({
  username: zod.string().min(3),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(6)
})

router.post("/signup", async (req, res) => {
  const {success} = signupBody.safeParse(req.body);

  if (!success) {
    return res.status(400).json({message: "Incorrect inputs!"});
  }

  const usernameTaken = await User.findOne({username: req.body.username});

  if (usernameTaken) {
    return res.status(409).json({message: "Username already taken."});
  }

  try {
    const user = await User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    });
  } catch(error) {
    return res.status(500).json({message: "User creation unsuccesfull!"});
  }

  const userId = user._id;
  const jwtSecret = config.jwtSecret;

  const token = jwt.sign({userId}, jwtSecret);

  res.status(201).json({message: "User created succesfully.", token: token});

})

const signinBody = zod.object({
  username: zod.string(),
  password: zod.string()
})

router.post("/signin", async (req, res) => {
  const {success} = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({message: "Incorrect inputs!"});
  }

  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password
    })
  } catch(error) {
    return res.status(401).json({message: "Unauthorized access!"});
  }

  const userId = user._id;
  const token = jwt.sign({userId}, jwtSecret);

  return res.status(200).json({message: "Sign in successful.", token: token});

})

router.post("/people", async (req, res) => {
  const filter = req.query.filer || "";

  try {
    const users = await User.find({
      $or: [{
        firstName: {
          "$regex": filter
        }
      }, {
        lastName: {
          "$regex": filter
        }
      }]
    })
    res.status(200).json({
      user: users.map(user => ({
        userId: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      }))
    })
    return;
  } catch(error) {
    return res.status(500).json({message: "Unsuccessful database fetch."});
  }
})

module.exports = router;