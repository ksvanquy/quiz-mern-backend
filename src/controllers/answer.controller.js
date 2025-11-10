const Answer = require('../models/answer.model');

exports.createAnswer = async (req, res) => {
  try {
    const answer = await Answer.create(req.body);
    res.status(201).json(answer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllAnswers = async (req, res) => {
  try {
    const answers = await Answer.find().populate('questionId');
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id).populate('questionId');
    if (!answer) return res.status(404).json({ error: 'Answer not found' });
    res.json(answer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(answer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAnswer = async (req, res) => {
  try {
    await Answer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Answer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
