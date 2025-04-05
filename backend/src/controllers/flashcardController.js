// src/controllers/flashcardController.js
const Flashcard = require('../models/Flashcard');
const Note = require('../models/Note');

// Get all flashcards
exports.getAllFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find()
      .populate('noteReference', 'title')
      .sort({ nextReview: 1 });
    res.status(200).json(flashcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get flashcards due for review today
exports.getDueFlashcards = async (req, res) => {
  try {
    const now = new Date();
    const flashcards = await Flashcard.find({ nextReview: { $lte: now } })
      .populate('noteReference', 'title')
      .sort({ nextReview: 1 });
    res.status(200).json(flashcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get flashcards by note ID
exports.getFlashcardsByNoteId = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ noteReference: req.params.noteId })
      .populate('noteReference', 'title');
    res.status(200).json(flashcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get flashcard by ID
exports.getFlashcardById = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id)
      .populate('noteReference');
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    res.status(200).json(flashcard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create flashcard
exports.createFlashcard = async (req, res) => {
  try {
    // Verify the note exists
    const noteExists = await Note.findById(req.body.noteReference);
    if (!noteExists) {
      return res.status(404).json({ message: 'Referenced note not found' });
    }
    
    const newFlashcard = new Flashcard(req.body);
    const savedFlashcard = await newFlashcard.save();
    res.status(201).json(savedFlashcard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update flashcard
exports.updateFlashcard = async (req, res) => {
  try {
    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFlashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    res.status(200).json(updatedFlashcard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete flashcard
exports.deleteFlashcard = async (req, res) => {
  try {
    const deletedFlashcard = await Flashcard.findByIdAndDelete(req.params.id);
    if (!deletedFlashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    res.status(200).json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process flashcard review
exports.reviewFlashcard = async (req, res) => {
  try {
    const { id } = req.params;
    const { quality } = req.body; // Rating 0-5
    
    if (quality < 0 || quality > 5) {
      return res.status(400).json({ message: 'Quality rating must be between 0 and 5' });
    }
    
    const flashcard = await Flashcard.findById(id);
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    
    flashcard.processReview(quality);
    const updatedFlashcard = await flashcard.save();
    
    res.status(200).json(updatedFlashcard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
