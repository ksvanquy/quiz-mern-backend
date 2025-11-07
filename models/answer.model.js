const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);
