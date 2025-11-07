const Node = require('../models/node.model');

exports.createNode = async (req, res) => {
  try {
    const node = await Node.create(req.body);
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
    const node = await Node.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
