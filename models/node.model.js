const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['category', 'subcategory', 'topic'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Node', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Node', nodeSchema);
