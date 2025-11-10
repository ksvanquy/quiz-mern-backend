const Node = require('../models/node.model');
const Assessment = require('../models/assessment.model');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');

// ---------------- Node ----------------
// Lấy Node theo parentId (category, subcategory, topic)
exports.getNodesByParent = async (req, res) => {
  try {
    let { parentId } = req.query;
    
    // Nếu parentId là 'null' hoặc không tồn tại, set thành null để lấy các node gốc
    if(!parentId || parentId === 'null') parentId = null; // root nodes
   
    const nodes = await Node.find({ parentId }).lean();
    res.json(nodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- Assessment ----------------
// Lấy Assessment theo nodeId
exports.getAssessmentsByNode = async (req, res) => {
  try {
    const { nodeId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const total = await Assessment.countDocuments({ nodeId });
    const assessments = await Assessment.find({ nodeId })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      assessments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- Question ----------------
// Lấy Question theo assessmentId
exports.getQuestionsByAssessment = async (req, res) => {
  try {
    const { assessmentId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const total = await Question.countDocuments({ assessmentId });
    const questions = await Question.find({ assessmentId })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      questions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- Answer ----------------
// Lấy Answer theo questionId
exports.getAnswersByQuestion = async (req, res) => {
  try {
    const { questionId } = req.query;
    const answers = await Answer.find({ questionId }).lean();
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
