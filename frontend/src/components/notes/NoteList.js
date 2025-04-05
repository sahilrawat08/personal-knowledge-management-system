import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/authService';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  margin: 0;
`;

const CreateButton = styled(Link)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-decoration: none;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    text-decoration: none;
  }
`;

const NoteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const NoteCard = styled(Link)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    text-decoration: none;
  }
`;

const NoteTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: 1.25rem;
`;

const NoteExcerpt = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.get('/notes');
        setNotes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return <EmptyState>Loading notes...</EmptyState>;
  }

  if (error) {
    return <EmptyState>Error: {error}</EmptyState>;
  }

  if (notes.length === 0) {
    return (
      <Container>
        <Header>
          <Title>My Notes</Title>
          <CreateButton to="/notes/new">Create Note</CreateButton>
        </Header>
        <EmptyState>
          <p>You haven't created any notes yet.</p>
          <CreateButton to="/notes/new">Create your first note</CreateButton>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My Notes</Title>
        <CreateButton to="/notes/new">Create Note</CreateButton>
      </Header>
      <NoteGrid>
        {notes.map((note) => (
          <NoteCard key={note._id} to={`/notes/${note._id}`}>
            <NoteTitle>{note.title}</NoteTitle>
            <NoteExcerpt>{note.content}</NoteExcerpt>
            {note.tags && note.tags.length > 0 && (
              <TagList>
                {note.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagList>
            )}
          </NoteCard>
        ))}
      </NoteGrid>
    </Container>
  );
};

export default NoteList; 