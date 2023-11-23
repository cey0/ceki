const mongoose = require('mongoose');

// Skema untuk model pengguna
const catalogSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    unique: true
  },
  harga: {
    type: Number,
    required: true
  }
});

// Membuat model User berdasarkan skema
const catalogM = mongoose.model('catalog', catalogSchema);

module.exports = catalogM;
