const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['quiz','exam','test'], required: true },
  nodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Node', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
