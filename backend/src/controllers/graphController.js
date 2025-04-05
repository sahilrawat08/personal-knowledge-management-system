const Note = require('../models/Note');

// Get the knowledge graph data
exports.getGraph = async (req, res) => {
  try {
    const notes = await Note.find().select('title links');
    
    // Transform notes into graph format
    const nodes = notes.map(note => ({
      id: note._id,
      label: note.title,
    }));

    // Create edges from note links
    const edges = [];
    notes.forEach(note => {
      note.links.forEach(link => {
        edges.push({
          from: note._id,
          to: link,
        });
      });
    });

    res.json({ nodes, edges });
  } catch (error) {
    console.error('Error getting graph:', error);
    res.status(500).json({ message: 'Error retrieving knowledge graph' });
  }
};

// Add a link between notes
exports.addLink = async (req, res) => {
  try {
    const { sourceId, targetId } = req.body;

    // Validate both notes exist
    const [sourceNote, targetNote] = await Promise.all([
      Note.findById(sourceId),
      Note.findById(targetId)
    ]);

    if (!sourceNote || !targetNote) {
      return res.status(404).json({ message: 'One or both notes not found' });
    }

    // Add link if it doesn't exist
    if (!sourceNote.links.includes(targetId)) {
      sourceNote.links.push(targetId);
      await sourceNote.save();
    }

    res.json(sourceNote);
  } catch (error) {
    console.error('Error adding link:', error);
    res.status(500).json({ message: 'Error adding link between notes' });
  }
};

// Remove a link between notes
exports.removeLink = async (req, res) => {
  try {
    const { sourceId, targetId } = req.body;

    const sourceNote = await Note.findById(sourceId);
    if (!sourceNote) {
      return res.status(404).json({ message: 'Source note not found' });
    }

    // Remove link if it exists
    sourceNote.links = sourceNote.links.filter(link => link.toString() !== targetId);
    await sourceNote.save();

    res.json(sourceNote);
  } catch (error) {
    console.error('Error removing link:', error);
    res.status(500).json({ message: 'Error removing link between notes' });
  }
}; 