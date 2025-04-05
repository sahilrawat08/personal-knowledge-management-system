const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

// Get knowledge graph data
router.get('/', graphController.getGraph);

// Add a link between notes
router.post('/link', graphController.addLink);

// Remove a link between notes
router.delete('/link', graphController.removeLink);

module.exports = router; 