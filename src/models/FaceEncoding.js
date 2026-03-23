// Create FaceModel in MongoDB
// src/models/FaceEncoding.js
const mongoose = require('mongoose');

const FaceEncodingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  descriptor: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FaceEncoding', FaceEncodingSchema);