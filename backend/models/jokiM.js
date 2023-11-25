const mongoose = require('mongoose');

// Skema untuk model pengguna
const tugasSchema = new mongoose.Schema({
  tugas: {
    type: String,
    required: true,
    unique: true
  },
  TugasDetail: {
    type : String,
    required: true

  },
  Nama: {
    type:String,
    required:true
  },
  tingkat:{
    type : String,
    required:true
  },
    nama: {
    type: Number,
    required: true,
    ref: 'catalog'
  },
  harga:{
    type: Number,
    required:true,
    ref: 'catalog'
  }
  

});

// Membuat model User berdasarkan skema
const tugasM = mongoose.model('tugas', tugasSchema);

module.exports = tugasM;
