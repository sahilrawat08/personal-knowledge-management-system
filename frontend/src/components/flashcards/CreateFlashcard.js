// frontend/src/components/flashcards/CreateFlashcard.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

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
`;

const CreateFlashcard = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  
  const [flashcard, setFlashcard] = useState({
    question: '',
    answer: '',
    noteReference: noteId || '',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  
  useEffect(() => {
    if (noteId) {
      // Fetch note details to show the title
      axios.get(`http://localhost:5000/api/notes/${noteId}`)
        .then(response => {
          setNoteTitle(response.data.title);
        })
        .catch(error => {
          console.error('Error fetching note:', error);
          setError('Failed to fetch note details');
        });
    }
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
    
    try {
      await axios.post('http://localhost:5000/api/flashcards', flashcard);
      navigate(noteId ? `/notes/${noteId}` : '/flashcards');
    } catch (error) {
      console.error('Error creating flashcard:', error);
      setError('Failed to create flashcard');
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
            {flashcard.tags.map(tag => (
              <div 
                key={tag} 
                style={{ 
                  background: '#e0e0e0', 
                  padding: '5px 10px', 
                  borderRadius: '15px', 
                  display: 'flex', 
                  alignItems: 'center' 
                }}
              >
                {tag}
                <span 
                  style={{ marginLeft: '5px', cursor: 'pointer' }} 
                  onClick={() => removeTag(tag)}
                >
                  ×
                </span>
              </div>
            ))}
          </div>
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button type="submit">Create Flashcard</Button>
      </Form>
    </Container>
  );
};

export default CreateFlashcard;