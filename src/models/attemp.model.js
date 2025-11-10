const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  startedAt: { type: Date, default: Date.now },
  finishedAt: { type: Date },
  totalScore: { type: Number, default: 0 },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      answerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true },
      isCorrect: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);
