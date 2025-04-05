// frontend/src/components/NoteEditor.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 400px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: monospace;
`;

const TagInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0055aa;
  }
`;

const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  
  useEffect(() => {
    if (isEditMode) {
      const fetchNote = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/notes/${id}`);
          const note = response.data;
          setTitle(note.title);
          setContent(note.content);
          setTags(note.tags || []);
          setTagInput(note.tags ? note.tags.join(', ') : '');
        } catch (error) {
          console.error('Error fetching note:', error);
        }
      };
      
      fetchNote();
    }
  }, [id, isEditMode]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Process tags
    const processedTags = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
    
    const noteData = {
      title,
      content,
      tags: processedTags
    };
    
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/notes/${id}`, noteData);
      } else {
        await axios.post('http://localhost:5000/api/notes', noteData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };
  
  return (
    <EditorContainer>
      <EditorHeader>
        <h1>{isEditMode ? 'Edit Note' : 'Create New Note'}</h1>
      </EditorHeader>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="content">Content</Label>
          <TextArea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <TagInput
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="tag1, tag2, tag3"
          />
        </FormGroup>
        
        <div>
          <CancelButton type="button" onClick={() => navigate('/')}>
            Cancel
          </CancelButton>
          <Button type="submit">
            {isEditMode ? 'Update Note' : 'Create Note'}
          </Button>
        </div>
      </form>
    </EditorContainer>
  );
};

export default NoteEditor;