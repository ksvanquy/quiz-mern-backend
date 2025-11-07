const express = require('express');
const router = express.Router();
const nodeController = require('../controllers/node.controller');

router.post('/', nodeController.createNode);
router.get('/', nodeController.getAllNodes);
router.get('/:id', nodeController.getNodeById);
router.put('/:id', nodeController.updateNode);
router.delete('/:id', nodeController.deleteNode);

module.exports = router;
