// frontend/src/components/notes/NoteView.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const Container = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.primary ? '#4a86e8' : '#e0e0e0'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Content = styled.div`
  line-height: 1.6;
  margin-bottom: 20px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 20px;
`;

const Tag = styled.span`
  background-color: #e0e0e0;
  padding: 3px 8px;
  border-radius: 15px;
  font-size: 12px;
`;

const MetaSection = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 15px;
`;

const LinkedNotesSection = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const LinkedNotesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const LinkedNoteItem = styled(Link)`
  text-decoration: none;
  color: #4a86e8;
  background-color: rgba(74, 134, 232, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  
  &:hover {
    background-color: rgba(74, 134, 232, 0.2);
  }
`;

const FlashcardsSection = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const FlashcardsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const FlashcardItem = styled.div`
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 14px;
`;

const FlashcardQuestion = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
`;

const FlashcardAnswer = styled.div`
  color: #666;
`;

const NoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [noteFlashcards, setNoteFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchNoteAndFlashcards();
  }, [id]);
  
  const fetchNoteAndFlashcards = async () => {
    try {
      setLoading(true);
      const noteResponse = await axios.get(`http://localhost:5000/api/notes/${id}`);
      setNote(noteResponse.data);
      
      const flashcardsResponse = await axios.get(`http://localhost:5000/api/flashcards/note/${id}`);
      setNoteFlashcards(flashcardsResponse.data);
    } catch (error) {
      console.error('Error fetching note:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`http://localhost:5000/api/notes/${id}`);
        navigate('/notes');
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!note) {
    return <div>Note not found</div>;
  }
  
  return (
    <Container>
      <NoteHeader>
        <Title>{note.title}</Title>
        <ButtonGroup>
          <Button onClick={() => navigate(`/flashcards/create/${id}`)}>
            Create Flashcard
          </Button>
          <Button onClick={() => navigate(`/notes/edit/${id}`)}>
            Edit
          </Button>
          <Button onClick={handleDelete}>
            Delete
          </Button>
        </ButtonGroup>
      </NoteHeader>
      
      <TagContainer>
        {note.tags.map(tag => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </TagContainer>
      
      <MetaSection>
        <div>Created: {formatDate(note.createdAt)}</div>
        <div>Last updated: {formatDate(note.updatedAt)}</div>
      </MetaSection>
      
      <Content>
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </Content>
      
      {note.linkedNotes && note.linkedNotes.length > 0 && (
        <LinkedNotesSection>
          <h3>Linked Notes</h3>
          <LinkedNotesList>
            {note.linkedNotes.map(linkedNote => (
              <LinkedNoteItem key={linkedNote._id} to={`/notes/${linkedNote._id}`}>
                {linkedNote.title}
              </LinkedNoteItem>
            ))}
          </LinkedNotesList>
        </LinkedNotesSection>
      )}
      
      <FlashcardsSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Flashcards ({noteFlashcards.length})</h3>
          <Button primary onClick={() => navigate(`/flashcards/create/${id}`)}>
            Add Flashcard
          </Button>
        </div>
        
        {noteFlashcards.length === 0 ? (
          <p>No flashcards created from this note yet.</p>
        ) : (
          <FlashcardsList>
            {noteFlashcards.map(flashcard => (
              <FlashcardItem key={flashcard._id}>
                <FlashcardQuestion>{flashcard.question}</FlashcardQuestion>
                <FlashcardAnswer>{flashcard.answer}</FlashcardAnswer>
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
                  Review count: {flashcard.reviewCount} · 
                  Next review: {formatDate(flashcard.nextReview)}
                </div>
              </FlashcardItem>
            ))}
          </FlashcardsList>
        )}
      </FlashcardsSection>
    </Container>
  );
};

export default NoteView; 