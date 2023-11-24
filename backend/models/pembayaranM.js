const mongoose = require('mongoose');

// Define the schema
const pembayaranSchema = new mongoose.Schema({
  tugasT: {
    type: String,
    required: true,
    unique: true
  },
  deskripsi: {
    type: String,
    required: true
  }
});

// Create the model using the schema
const Pembayaran = mongoose.model('Pembayaran', pembayaranSchema);

module.exports = Pembayaran;
