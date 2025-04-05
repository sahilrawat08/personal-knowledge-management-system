// frontend/src/components/flashcards/FlashcardList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const FlashcardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const FlashcardCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const FlashcardQuestion = styled.div`
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 16px;
`;

const FlashcardAnswer = styled.div`
  color: #666;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const FlashcardMeta = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #eee;
`;

const FlashcardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
`;

const Tag = styled.span`
  background-color: #e0e0e0;
  padding: 3px 8px;
  border-radius: 15px;
  font-size: 12px;
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

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 10px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const FlashcardList = () => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    dueToday: 0,
    reviewed: 0
  });
  
  useEffect(() => {
    fetchFlashcards();
  }, []);
  
  const fetchFlashcards = async () => {
    try {
      // Get all flashcards
      const response = await axios.get('http://localhost:5000/api/flashcards');
      const cards = response.data;
      setFlashcards(cards);
      setFilteredFlashcards(cards);
      
      // Extract all unique tags
      const tagsSet = new Set();
      cards.forEach(card => {
        card.tags.forEach(tag => tagsSet.add(tag));
      });
      setAllTags(Array.from(tagsSet));
      
      // Get due cards count
      const dueResponse = await axios.get('http://localhost:5000/api/flashcards/due');
      
      // Calculate stats
      setStats({
        total: cards.length,
        dueToday: dueResponse.data.length,
        reviewed: cards.filter(card => card.reviewCount > 0).length
      });
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };
  
  useEffect(() => {
    // Filter flashcards based on search term and tag
    let filtered = flashcards;
    
    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        card.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterTag) {
      filtered = filtered.filter(card => 
        card.tags.includes(filterTag)
      );
    }
    
    setFilteredFlashcards(filtered);
  }, [searchTerm, filterTag, flashcards]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTagFilterChange = (e) => {
    setFilterTag(e.target.value);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        await axios.delete(`http://localhost:5000/api/flashcards/${id}`);
        fetchFlashcards(); // Refresh the list
      } catch (error) {
        console.error('Error deleting flashcard:', error);
      }
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <Container>
      <Header>
        <h2>Flashcards</h2>
        <ActionBar>
          <Button onClick={() => navigate('/flashcards/review')}>
            Review Due Cards ({stats.dueToday})
          </Button>
          <Button onClick={() => navigate('/flashcards/create')}>
            Create Flashcard
          </Button>
        </ActionBar>
      </Header>
      
      <StatsContainer>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Flashcards</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.dueToday}</StatValue>
          <StatLabel>Due Today</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.reviewed}</StatValue>
          <StatLabel>Cards Reviewed</StatLabel>
        </StatCard>
      </StatsContainer>
      
      <FilterContainer>
        <FilterInput
          type="text"
          placeholder="Search flashcards..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Select value={filterTag} onChange={handleTagFilterChange}>
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </Select>
      </FilterContainer>
      
      {filteredFlashcards.length === 0 ? (
        <EmptyState>
          <h3>No flashcards found</h3>
          {searchTerm || filterTag ? (
            <p>Try adjusting your search or filter criteria.</p>
          ) : (
            <p>Start by creating your first flashcard!</p>
          )}
        </EmptyState>
      ) : (
        <FlashcardGrid>
          {filteredFlashcards.map(card => (
            <FlashcardCard key={card._id}>
              <FlashcardQuestion>{card.question}</FlashcardQuestion>
              <FlashcardAnswer>{card.answer}</FlashcardAnswer>
              
              <FlashcardTags>
                {card.tags.map(tag => (
                  <Tag key={tag} onClick={() => setFilterTag(tag)}>
                    {tag}
                  </Tag>
                ))}
              </FlashcardTags>
              
              <FlashcardMeta>
                <div>From note: <Link to={`/notes/${card.noteReference._id}`}>
                  {card.noteReference.title}
                </Link></div>
                <div>Next review: {formatDate(card.nextReview)}</div>
                <div>Review count: {card.reviewCount}</div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <Link to={`/flashcards/edit/${card._id}`} style={{ color: '#4a86e8' }}>
                    Edit
                  </Link>
                  <span 
                    style={{ color: '#f44336', cursor: 'pointer' }}
                    onClick={() => handleDelete(card._id)}
                  >
                    Delete
                  </span>
                </div>
              </FlashcardMeta>
            </FlashcardCard>
          ))}
        </FlashcardGrid>
      )}
    </Container>
  );
};

export default FlashcardList;