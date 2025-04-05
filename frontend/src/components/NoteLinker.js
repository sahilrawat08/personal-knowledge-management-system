// frontend/src/components/NoteLinker.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const LinkerContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const NoteList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
`;

const NoteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const LinkButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: ${props => props.linked ? '#4CAF50' : '#0066cc'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const NoteLinker = ({ currentNoteId, onLinkCreated }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/notes');
        // Filter out the current note
        const otherNotes = response.data.filter(note => note._id !== currentNoteId);
        setNotes(otherNotes);
        setFilteredNotes(otherNotes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notes for linking:', error);
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, [currentNoteId]);
  
  useEffect(() => {
    // Filter notes based on search term
    if (searchTerm.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setFilteredNotes(filtered);
    }
  }, [searchTerm, notes]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleLink = async (targetNoteId) => {
    try {
      // Check if the link already exists
      const targetNote = notes.find(note => note._id === targetNoteId);
      const isLinked = targetNote.links && targetNote.links.includes(currentNoteId);
      
      if (isLinked) {
        // Remove the link
        // In a real app, you'd implement an API endpoint for removing links
        alert('Link removal functionality not yet implemented');
      } else {
        // Create the link
        await axios.post('http://localhost:5000/api/notes/link', {
          sourceId: currentNoteId,
          targetId: targetNoteId
        });
        
        // Refetch notes to update the UI
        const response = await axios.get('http://localhost:5000/api/notes');
        const otherNotes = response.data.filter(note => note._id !== currentNoteId);
        setNotes(otherNotes);
        setFilteredNotes(otherNotes);
        
        // Notify parent component
        if (onLinkCreated) {
          onLinkCreated();
        }
      }
    } catch (error) {
      console.error('Error toggling link:', error);
    }
  };
  
  if (loading) {
    return <div>Loading available notes for linking...</div>;
  }
  
  return (
    <LinkerContainer>
      <Title>Link to Other Notes</Title>
      <SearchInput 
        type="text" 
        placeholder="Search notes by title or tag..."
        value={searchTerm}
        onChange={handleSearch}
      />
      
      <NoteList>
        {filteredNotes.length === 0 ? (
          <p>No notes found matching your search.</p>
        ) : (
          filteredNotes.map(note => {
            const isLinked = note.links && note.links.includes(currentNoteId);
            
            return (
              <NoteItem key={note._id}>
                <div>
                  <strong>{note.title}</strong>
                  {note.tags && note.tags.length > 0 && (
                    <span> - {note.tags.join(', ')}</span>
                  )}
                </div>
                <LinkButton 
                  linked={isLinked}
                  onClick={() => toggleLink(note._id)}
                >
                  {isLinked ? 'Linked' : 'Link'}
                </LinkButton>
              </NoteItem>
            );
          })
        )}
      </NoteList>
    </LinkerContainer>
  );
};

export default NoteLinker;