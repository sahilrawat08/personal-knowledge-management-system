// backend/src/controllers/noteController.js
const Note = require('../models/Note');

// Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('links');
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const newNote = new Note(req.body);
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create bidirectional link between notes
exports.createLink = async (req, res) => {
  try {
    const { sourceId, targetId } = req.body;
    
    // Add targetId to sourceNote links
    const sourceNote = await Note.findByIdAndUpdate(
      sourceId,
      { $addToSet: { links: targetId } },
      { new: true }
    );
    
    // Add sourceId to targetNote links
    const targetNote = await Note.findByIdAndUpdate(
      targetId,
      { $addToSet: { links: sourceId } },
      { new: true }
    );
    
    if (!sourceNote || !targetNote) {
      return res.status(404).json({ message: 'One or both notes not found' });
    }
    
    res.status(200).json({ 
      message: 'Link created successfully',
      sourceNote,
      targetNote
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};