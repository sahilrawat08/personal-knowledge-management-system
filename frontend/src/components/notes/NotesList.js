// frontend/src/components/NotesList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getNotes, deleteNote as deleteNoteApi } from '../../services/api';

const NotesContainer = styled.div`
  padding: 1rem;
`;

const NoteCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
`;

const NoteTitle = styled.h2`
  margin-bottom: 0.5rem;
`;

const NoteExcerpt = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const TagsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background-color: #e0e0e0;
  border-radius: 15px;
  padding: 3px 10px;
  font-size: 0.8rem;
`;

const ActionLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionLink = styled(Link)`
  text-decoration: none;
  color: #0066cc;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #cc0000;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #666;
`;

const CreateNoteButton = styled(Link)`
  display: inline-block;
  background-color: #0066cc;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #0052a3;
  }
`;

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchNotes();
  }, []);
  
  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotes();
      setNotes(response.data);
    } catch (error) {
      setError('Failed to fetch notes. Please try again later.');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNoteApi(id);
        setNotes(notes.filter(note => note._id !== id));
      } catch (error) {
        setError('Failed to delete note. Please try again later.');
        console.error('Error deleting note:', error);
      }
    }
  };
  
  const getExcerpt = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  if (loading) {
    return <LoadingSpinner>Loading notes...</LoadingSpinner>;
  }
  
  return (
    <NotesContainer>
      <h1>My Notes</h1>
      <CreateNoteButton to="/notes/new">Create New Note</CreateNoteButton>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!loading && notes.length === 0 ? (
        <p>No notes yet. Create your first note to get started!</p>
      ) : (
        notes.map(note => (
          <NoteCard key={note._id}>
            <NoteTitle>{note.title}</NoteTitle>
            <NoteExcerpt>{getExcerpt(note.content)}</NoteExcerpt>
            
            {note.tags && note.tags.length > 0 && (
              <TagsRow>
                {note.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagsRow>
            )}
            
            <ActionLinks>
              <ActionLink to={`/notes/${note._id}`}>View</ActionLink>
              <ActionLink to={`/notes/edit/${note._id}`}>Edit</ActionLink>
              <DeleteButton onClick={() => handleDeleteNote(note._id)}>
                Delete
              </DeleteButton>
            </ActionLinks>
          </NoteCard>
        ))
      )}
    </NotesContainer>
  );
};

export default NotesList;