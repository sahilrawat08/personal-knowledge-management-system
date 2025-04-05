// frontend/src/components/notes/NoteView.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import NoteLinker from '../NoteLinker';
import { getNote, deleteNote } from '../../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const NoteContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
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
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.primary ? '#2196f3' : props.danger ? '#f44336' : '#e0e0e0'};
  color: ${props => props.primary || props.danger ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const Content = styled.div`
  line-height: 1.6;
  color: #333;
  
  h1, h2, h3, h4, h5, h6 {
    color: #333;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  p {
    margin-bottom: 1em;
  }
  
  code {
    background-color: #f5f5f5;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  blockquote {
    border-left: 4px solid #ddd;
    margin: 0;
    padding-left: 1em;
    color: #666;
  }
  
  ul, ol {
    padding-left: 1.5em;
    margin-bottom: 1em;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const Tag = styled.span`
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
`;

const MetaSection = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  
  > div {
    margin-bottom: 4px;
  }
`;

const LinkedNotesSection = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const LinkedNotesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const LinkedNoteCard = styled.div`
  background-color: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const LinkedNoteTitle = styled.div`
  font-weight: 500;
  color: #1976d2;
  margin-bottom: 8px;
`;

const LinkedNoteMeta = styled.div`
  font-size: 12px;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const NoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNote = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNote(id);
      setNote(response.data);
    } catch (error) {
      console.error('Error fetching note:', error);
      setError('Failed to load note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        await deleteNote(id);
        navigate('/notes');
      } catch (error) {
        console.error('Error deleting note:', error);
        setError('Failed to delete note. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!note) {
    return <div>Note not found</div>;
  }

  return (
    <Container>
      <NoteContainer>
        <NoteHeader>
          <Title>{note.title}</Title>
          <ButtonGroup>
            <Button primary onClick={() => navigate(`/notes/edit/${id}`)}>
              Edit
            </Button>
            <Button onClick={() => navigate(`/flashcards/create/${id}`)}>
              Create Flashcard
            </Button>
            <Button danger onClick={handleDelete}>
              Delete
            </Button>
          </ButtonGroup>
        </NoteHeader>

        {note.tags && note.tags.length > 0 && (
          <TagContainer>
            {note.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagContainer>
        )}

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
                <LinkedNoteCard 
                  key={linkedNote._id}
                  onClick={() => navigate(`/notes/${linkedNote._id}`)}
                >
                  <LinkedNoteTitle>{linkedNote.title}</LinkedNoteTitle>
                  {linkedNote.tags && linkedNote.tags.length > 0 && (
                    <LinkedNoteMeta>
                      Tags: {linkedNote.tags.join(', ')}
                    </LinkedNoteMeta>
                  )}
                </LinkedNoteCard>
              ))}
            </LinkedNotesList>
          </LinkedNotesSection>
        )}
      </NoteContainer>

      <NoteLinker 
        currentNoteId={id} 
        onLinkUpdated={fetchNote}
      />
    </Container>
  );
};

export default NoteView; 