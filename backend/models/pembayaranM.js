const mongoose = require('mongoose');

// Define the schema
const bayarM = new mongoose.Schema({
    
    // Menambahkan properti untuk menyimpan total pembayaran
    idBayar: {
        type : String,
        required : true,
        unique : true
      },
    totalPembayaran: {
        type: Number,
        required: true
      },
      statusPembayaran: {
        type: String,
        enum: ['Belum Dibayar', 'Sudah Dibayar'],
        default: 'Belum Dibayar'
      },
      tanggalPembayaran: {
        type: Date
      },
      Responsemidtrans:{
        type : String,
        require : true
      }
});

// Create the model using the schema
const Pembayaran = mongoose.model('Pembayaran', bayarM);

module.exports = Pembayaran;
