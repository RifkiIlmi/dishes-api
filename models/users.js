const mongoose = require('mongoose');
const passportLM = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    default: '',
  },
  lastname: {
    type: String,
    default: '',
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLM);

const User = mongoose.model('User', userSchema);

module.exports = User;
