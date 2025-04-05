// backend/src/routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Get all notes
router.get('/', noteController.getAllNotes);

// Get all tags
router.get('/tags', noteController.getAllTags);

// Get notes by tag
router.get('/tag/:tag', noteController.getNotesByTag);

// Get a single note
router.get('/:id', noteController.getNoteById);

// Create a new note
router.post('/', noteController.createNote);

// Update a note
router.put('/:id', noteController.updateNote);

// Delete a note
router.delete('/:id', noteController.deleteNote);

// Create a link between notes
router.post('/link', noteController.createLink);

module.exports = router;