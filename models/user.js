const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  email: {
    type: String,
    required: true,
    match: /^\S+@\S+$/
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    minLength: 5,
    maxLength: 250
  },
  registrationDate: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

const User = mongoose.model('user', userSchema);

module.exports.User = User;