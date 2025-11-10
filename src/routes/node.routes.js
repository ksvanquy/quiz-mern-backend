const express = require('express');
const router = express.Router();
const nodeController = require('../controllers/node.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Create: require authenticated user (teacher/admin)
router.post('/', authenticate, authorize(['admin', 'teacher']), nodeController.createNode);
// Read (list) - public
router.get('/', nodeController.getAllNodes);
// Read (single) - public
router.get('/:id', nodeController.getNodeById);
// Update - require authenticated user (teacher/admin)
router.put('/:id', authenticate, authorize(['admin', 'teacher']), nodeController.updateNode);
// Delete - restrict to admin
router.delete('/:id', authenticate, authorize(['admin']), nodeController.deleteNode);

module.exports = router;
