
// src/routes/flashcardRoutes.js
const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');

// GET all flashcards
router.get('/', flashcardController.getAllFlashcards);

// GET flashcards due for review
router.get('/due', flashcardController.getDueFlashcards);

// GET flashcards by note ID
router.get('/note/:noteId', flashcardController.getFlashcardsByNoteId);

// GET single flashcard by ID
router.get('/:id', flashcardController.getFlashcardById);

// POST create new flashcard
router.post('/', flashcardController.createFlashcard);

// PUT update flashcard
router.put('/:id', flashcardController.updateFlashcard);

// POST process flashcard review
router.post('/:id/review', flashcardController.reviewFlashcard);

// DELETE flashcard
router.delete('/:id', flashcardController.deleteFlashcard);

module.exports = router;