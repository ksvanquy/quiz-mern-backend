const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answer.controller');

router.post('/', answerController.createAnswer);
router.get('/', answerController.getAllAnswers);
router.get('/:id', answerController.getAnswerById);
router.put('/:id', answerController.updateAnswer);
router.delete('/:id', answerController.deleteAnswer);

module.exports = router;
