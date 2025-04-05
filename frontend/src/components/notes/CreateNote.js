import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/authService';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const Form = styled.form`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid #ddd;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid #ddd;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 16px;
  min-height: 200px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const TagInput = styled(Input)`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RemoveTag = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  padding: 0;
  font-size: 1.25rem;
  line-height: 1;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  ${({ primary, theme }) => primary ? `
    background-color: ${theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${theme.colors.secondary};
    }
  ` : `
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    
    &:hover {
      background-color: #ddd;
    }
  `}
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
`;

const CreateNote = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, currentTag.trim()]
        });
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/notes', formData);
      navigate('/notes');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Create New Note</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="content">Content</Label>
          <TextArea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tags">Tags</Label>
          <TagInput
            type="text"
            id="tags"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={handleTagKeyPress}
            placeholder="Type a tag and press Enter"
          />
          <TagList>
            {formData.tags.map((tag, index) => (
              <Tag key={index}>
                {tag}
                <RemoveTag onClick={() => removeTag(tag)}>&times;</RemoveTag>
              </Tag>
            ))}
          </TagList>
        </FormGroup>

        <ButtonGroup>
          <Button type="button" onClick={() => navigate('/notes')}>
            Cancel
          </Button>
          <Button type="submit" primary disabled={loading}>
            {loading ? 'Creating...' : 'Create Note'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default CreateNote; 