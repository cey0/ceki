const mongoose = require('mongoose');

// Skema untuk model pengguna
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type : String ,
    enum : ["user","admin"],
    default : "user"
  }
});

// Membuat model User berdasarkan skema
const userM = mongoose.model('User', userSchema);

module.exports = userM;
