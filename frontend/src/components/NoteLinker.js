// frontend/src/components/NoteLinker.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { addLink, removeLink } from '../services/api';

const LinkerContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const NoteList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const NoteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
  background-color: white;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const NoteInfo = styled.div`
  flex: 1;
`;

const NoteTitle = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
`;

const NoteTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

const LinkButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.linked ? '#4CAF50' : '#2196f3'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 14px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
`;

const NoteLinker = ({ currentNoteId, onLinkUpdated }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linkingInProgress, setLinkingInProgress] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [currentNoteId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/notes');
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      
      // Filter out the current note and transform the data
      const otherNotes = data.filter(note => note._id !== currentNoteId).map(note => ({
        ...note,
        isLinked: note.links?.includes(currentNoteId) || false
      }));
      
      setNotes(otherNotes);
      setFilteredNotes(otherNotes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to load notes. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
      setFilteredNotes(filtered);
    }
  }, [searchTerm, notes]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleLink = async (targetNoteId, isCurrentlyLinked) => {
    try {
      setLinkingInProgress(true);
      setError(null);

      if (isCurrentlyLinked) {
        await removeLink(currentNoteId, targetNoteId);
      } else {
        await addLink(currentNoteId, targetNoteId);
      }

      // Update the local state
      const updatedNotes = notes.map(note => {
        if (note._id === targetNoteId) {
          return { ...note, isLinked: !isCurrentlyLinked };
        }
        return note;
      });
      
      setNotes(updatedNotes);
      setFilteredNotes(updatedNotes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ));

      // Notify parent component
      if (onLinkUpdated) {
        onLinkUpdated();
      }
    } catch (error) {
      console.error('Error toggling link:', error);
      setError(isCurrentlyLinked ? 
        'Failed to remove link. Please try again.' : 
        'Failed to create link. Please try again.'
      );
    } finally {
      setLinkingInProgress(false);
    }
  };

  if (loading) {
    return (
      <LinkerContainer>
        <LoadingSpinner>Loading available notes...</LoadingSpinner>
      </LinkerContainer>
    );
  }

  return (
    <LinkerContainer>
      <Title>Link to Other Notes</Title>
      
      <SearchInput 
        type="text" 
        placeholder="Search notes by title or tags..."
        value={searchTerm}
        onChange={handleSearch}
      />
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <NoteList>
        {filteredNotes.length === 0 ? (
          <EmptyState>
            {searchTerm ? 'No notes match your search.' : 'No other notes available.'}
          </EmptyState>
        ) : (
          filteredNotes.map(note => (
            <NoteItem key={note._id}>
              <NoteInfo>
                <NoteTitle>{note.title}</NoteTitle>
                {note.tags && note.tags.length > 0 && (
                  <NoteTags>
                    {note.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </NoteTags>
                )}
              </NoteInfo>
              <LinkButton 
                linked={note.isLinked}
                onClick={() => toggleLink(note._id, note.isLinked)}
                disabled={linkingInProgress}
              >
                {note.isLinked ? 'Unlink' : 'Link'}
              </LinkButton>
            </NoteItem>
          ))
        )}
      </NoteList>
    </LinkerContainer>
  );
};

export default NoteLinker;