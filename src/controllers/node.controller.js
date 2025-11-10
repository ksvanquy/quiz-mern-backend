const Node = require('../models/node.model');

exports.createNode = async (req, res) => {
  try {
    // Ensure createdBy is the authenticated user (if available)
    const payload = Object.assign({}, req.body);
    if (req.user && req.user._id) payload.createdBy = req.user._id;
    const node = await Node.create(payload);
    res.status(201).json(node);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllNodes = async (req, res) => {
  try {
    const nodes = await Node.find();
    res.json(nodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNodeById = async (req, res) => {
  try {
    const node = await Node.findById(req.params.id);
    if (!node) return res.status(404).json({ error: 'Node not found' });
    res.json(node);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNode = async (req, res) => {
  try {
    // Track who updated the node when authenticated
    const updates = Object.assign({}, req.body);
    if (req.user && req.user._id) updates.updatedBy = req.user._id;
    const node = await Node.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(node);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteNode = async (req, res) => {
  try {
    await Node.findByIdAndDelete(req.params.id);
    res.json({ message: 'Node deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
