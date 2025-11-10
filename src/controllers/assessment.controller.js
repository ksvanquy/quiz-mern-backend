const Assessment = require('../models/assessment.model');

exports.createAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.create(req.body);
    res.status(201).json(assessment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find().populate('nodeId');
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('nodeId');
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(assessment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    await Assessment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assessment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
