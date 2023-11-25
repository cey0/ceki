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
  
  // Sebelum menyimpan tugas ke dalam database, Anda dapat menghitung total pembayaran menggunakan informasi harga dari catalogId.
  tugasSchema.pre('save', async function (next) {
    try {
      const catalog = await this.model('catalog').findOne({ _id: this.catalogId });
      if (catalog) {
        this.totalPembayaran = catalog.harga; // Menggunakan informasi harga dari catalog untuk total pembayaran
      }
      next();
    } catch (error) {
      next(error);
    }
  });
  
  const tugasM = mongoose.model('tugas', tugasSchema);
  
  module.exports = tugasM;
  