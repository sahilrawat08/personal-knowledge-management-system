// frontend/src/components/flashcards/CreateFlashcard.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createFlashcard, getNote } from '../../services/api';

const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const TagInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #4a86e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: #3b78e7;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin-top: 15px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
`;

const Tag = styled.div`
  background: #e0e0e0;
  padding: 5px 10px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const TagRemoveButton = styled.span`
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    color: #d32f2f;
  }
`;

const CreateFlashcard = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  
  const [flashcard, setFlashcard] = useState({
    question: '',
    answer: '',
    noteReference: noteId || '000000000000000000000000', // Default ObjectId if no note
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchNoteDetails = async () => {
      if (noteId) {
        try {
          const response = await getNote(noteId);
          setNoteTitle(response.data.title);
        } catch (error) {
          console.error('Error fetching note:', error);
          setError('Failed to fetch note details');
        }
      }
    };
    
    fetchNoteDetails();
  }, [noteId]);
  
  const handleChange = (e) => {
    setFlashcard({
      ...flashcard,
      [e.target.name]: e.target.value
    });
  };
  
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!flashcard.tags.includes(newTag)) {
        setFlashcard({
          ...flashcard,
          tags: [...flashcard.tags, newTag]
        });
      }
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setFlashcard({
      ...flashcard,
      tags: flashcard.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await createFlashcard(flashcard);
      navigate(noteId ? `/notes/${noteId}` : '/flashcards');
    } catch (error) {
      console.error('Error creating flashcard:', error);
      setError(error.response?.data?.message || 'Failed to create flashcard. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <h2>Create Flashcard</h2>
      {noteTitle && <p>From note: {noteTitle}</p>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="question">Question</Label>
          <TextArea
            id="question"
            name="question"
            value={flashcard.question}
            onChange={handleChange}
            required
            placeholder="Enter your question here..."
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="answer">Answer</Label>
          <TextArea
            id="answer"
            name="answer"
            value={flashcard.answer}
            onChange={handleChange}
            required
            placeholder="Enter the answer here..."
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="tags">Tags</Label>
          <TagInput
            id="tags"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyPress={handleTagKeyPress}
            placeholder="Add tags and press Enter"
          />
          <TagsContainer>
            {flashcard.tags.map(tag => (
              <Tag key={tag}>
                {tag}
                <TagRemoveButton onClick={() => removeTag(tag)}>×</TagRemoveButton>
              </Tag>
            ))}
          </TagsContainer>
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Flashcard'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateFlashcard;