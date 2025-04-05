// frontend/src/components/NotesList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

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

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/notes');
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    
    fetchNotes();
  }, []);
  
  const deleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`http://localhost:5000/api/notes/${id}`);
        setNotes(notes.filter(note => note._id !== id));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };
  
  const getExcerpt = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  return (
    <NotesContainer>
      <h1>My Notes</h1>
      {notes.length === 0 ? (
        <p>No notes yet. <Link to="/note/new">Create your first note</Link></p>
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
              <ActionLink to={`/note/${note._id}`}>View</ActionLink>
              <ActionLink to={`/note/edit/${note._id}`}>Edit</ActionLink>
              <DeleteButton onClick={() => deleteNote(note._id)}>
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