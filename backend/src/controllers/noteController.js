// backend/src/controllers/noteController.js
const Note = require('../models/Note');

// Get all notes for the current user
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('links', 'title');
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Failed to fetch notes. Please try again.' });
  }
};

// Get all unique tags for the current user
exports.getAllTags = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).select('tags');
    const tags = new Set();
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => tags.add(tag));
      }
    });
    res.status(200).json(Array.from(tags));
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Failed to fetch tags. Please try again.' });
  }
};

// Get notes by tag for the current user
exports.getNotesByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const notes = await Note.find({ 
      user: req.user.id,
      tags: tag 
    }).populate('links', 'title');
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes by tag:', error);
    res.status(500).json({ message: 'Failed to fetch notes. Please try again.' });
  }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('links', 'title');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: 'Failed to fetch note. Please try again.' });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const newNote = new Note({
      ...req.body,
      user: req.user.id
    });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(400).json({ message: 'Failed to create note. Please try again.' });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { 
        _id: req.params.id,
        user: req.user.id
      },
      req.body,
      { new: true }
    ).populate('links', 'title');

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(400).json({ message: 'Failed to update note. Please try again.' });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Remove this note from all other notes' links
    await Note.updateMany(
      { links: req.params.id },
      { $pull: { links: req.params.id } }
    );

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Failed to delete note. Please try again.' });
  }
};

// Create bidirectional link between notes
exports.createLink = async (req, res) => {
  try {
    const { sourceId, targetId } = req.body;
    
    // Verify both notes belong to the current user
    const [sourceNote, targetNote] = await Promise.all([
      Note.findOne({ _id: sourceId, user: req.user.id }),
      Note.findOne({ _id: targetId, user: req.user.id })
    ]);
    
    if (!sourceNote || !targetNote) {
      return res.status(404).json({ message: 'One or both notes not found' });
    }
    
    // Add links bidirectionally
    await Promise.all([
      Note.findByIdAndUpdate(
        sourceId,
        { $addToSet: { links: targetId } },
        { new: true }
      ),
      Note.findByIdAndUpdate(
        targetId,
        { $addToSet: { links: sourceId } },
        { new: true }
      )
    ]);
    
    const updatedSourceNote = await Note.findById(sourceId).populate('links', 'title');
    
    res.status(200).json({ 
      message: 'Link created successfully',
      note: updatedSourceNote
    });
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ message: 'Failed to create link. Please try again.' });
  }
};