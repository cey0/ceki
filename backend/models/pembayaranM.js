const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order_id: { type: String, required: true },
    gross_amount: { type: Number, required: true },
    customer_details: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    payment_method: { type: String, default: 'QRIS' },
    transaction_time: { type: Date, default: Date.now },
    catalog: { type: mongoose.Schema.Types.ObjectId, ref: 'catalog' } // Referensi ke model catalogM
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
