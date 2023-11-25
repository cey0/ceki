const mongoose = require('mongoose');

// Define the schema
const qrisM = new mongoose.Schema({
  IDQRIS: {
    type: String,
    required: true,
    unique: true
  },
  merchantID: {
    type: String,
    required: true
  },
  harga
});

// Create the model using the schema
const Pembayaran = mongoose.model('Pembayaran', qrisM);

module.exports = Pembayaran;
