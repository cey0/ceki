const mongoose = require('mongoose');

// Define the schema for the 'tugas' model
const tugasSchema = new mongoose.Schema({
  tugas: {
    type: String,
    required: true
  },
  TugasDetail: {
    type: String,
    required: true
  },
  tingkat: {
    type: String,
    required: true
  },
  // Reference to the 'catalog' model
  nama: {
    type: String,
    required: true
  },
  transaction   : {
    type: String,
   
  },
  harga: {
    type: Number,
    required: true
  },
  // User-related fields
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

// Define the 'tugas' model based on the schema
const tugasM = mongoose.model('tugas', tugasSchema);

module.exports = tugasM;
