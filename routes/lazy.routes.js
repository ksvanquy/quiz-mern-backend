const express = require('express');
const router = express.Router();
const lazyController = require('../controllers/lazy.controller');

// Node
router.get('/nodes', lazyController.getNodesByParent);

// Assessment
router.get('/assessments', lazyController.getAssessmentsByNode);

// Question
router.get('/questions', lazyController.getQuestionsByAssessment);

// Answer
router.get('/answers', lazyController.getAnswersByQuestion);

module.exports = router;
