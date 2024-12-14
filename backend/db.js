const mongoose = require("mongoose");
const config = require("./config");

function connectDatabase() {
  try {
    mongoose.connect(config.dbUrl);
    console.log("Sucessfully connected to the Database.")
  } catch(error) {
    console.log("Error connecting to the database.")
  }
}

connectDatabase();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minLength: 3,
    maxLength: 30
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  }
})


const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
})


const User = mongoose.model("users", userSchema);
const Account = mongoose.model("accounts", accountSchema);

module.exports = {
  User,
  Account
};