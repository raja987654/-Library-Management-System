const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // Chemin de l'image
    pdf: { type: String },   // Chemin du PDF
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
