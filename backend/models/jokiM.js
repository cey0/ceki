const mongoose = require('mongoose');

const tugasSchema = new mongoose.Schema({
  tugas: {
    type: String,
    required: true,
    unique: true
  },
  TugasDetail: {
    type: String,
    required: true
  },
  Nama: {
    type: String,
    required: true
  },
  tingkat: {
    type: String,
    required: true
  },
  // Menggunakan ObjectId untuk merujuk ke model 'catalog'
  catalogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'catalog' // Nama model referensi
  }
});

const tugasM = mongoose.model('tugas', tugasSchema);

module.exports = tugasM;
