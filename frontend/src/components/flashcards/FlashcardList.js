// frontend/src/components/flashcards/FlashcardList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getFlashcards, getDueFlashcards, deleteFlashcard } from '../../services/api';

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

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const TagSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
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
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
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
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${props => props.primary ? '#2196f3' : props.danger ? '#f44336' : '#e0e0e0'};
  color: ${props => props.primary || props.danger ? 'white' : '#333'};
  
  &:hover {
    opacity: 0.9;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const ReviewButton = styled(ActionButton)`
  background-color: ${props => props.due ? '#4caf50' : '#e0e0e0'};
  color: ${props => props.due ? 'white' : '#333'};
  margin-right: 10px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterBadge = styled.span`
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 10px;
`;

const SortSelect = styled(TagSelect)`
  min-width: 120px;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const PreviewButton = styled.button`
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const FlashcardList = () => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState('nextReview');
  const [allTags, setAllTags] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    dueToday: 0,
    reviewed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewCard, setPreviewCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  useEffect(() => {
    fetchFlashcards();
  }, []);
  
  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all flashcards
      const response = await getFlashcards();
      const cards = response.data;
      setFlashcards(cards);
      setFilteredFlashcards(cards);
      
      // Extract all unique tags
      const tagsSet = new Set();
      cards.forEach(card => {
        if (card.tags && Array.isArray(card.tags)) {
          card.tags.forEach(tag => tagsSet.add(tag));
        }
      });
      setAllTags(Array.from(tagsSet).sort());
      
      // Get due cards count
      const dueResponse = await getDueFlashcards();
      
      // Calculate stats
      setStats({
        total: cards.length,
        dueToday: dueResponse.data.length,
        reviewed: cards.filter(card => card.reviewCount > 0).length
      });
    } catch (error) {
      setError('Failed to fetch flashcards. Please try again later.');
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Filter and sort flashcards
    let filtered = flashcards;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(card => 
        card.question.toLowerCase().includes(searchLower) || 
        card.answer.toLowerCase().includes(searchLower)
      );
    }
    
    if (filterTag) {
      filtered = filtered.filter(card => 
        card.tags && Array.isArray(card.tags) && card.tags.includes(filterTag)
      );
    }
    
    // Sort flashcards
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nextReview':
          return new Date(a.nextReview) - new Date(b.nextReview);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'reviewed':
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });
    
    setFilteredFlashcards(filtered);
  }, [searchTerm, filterTag, sortBy, flashcards]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTagFilterChange = (e) => {
    setFilterTag(e.target.value);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const handlePreview = (card) => {
    setPreviewCard(card);
    setShowAnswer(false);
  };
  
  const closePreview = () => {
    setPreviewCard(null);
    setShowAnswer(false);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        await deleteFlashcard(id);
        await fetchFlashcards(); // Refresh the list
      } catch (error) {
        setError('Failed to delete flashcard. Please try again.');
        console.error('Error deleting flashcard:', error);
      }
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading flashcards...</LoadingSpinner>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <div>
          <h2>
            Flashcards
            {(searchTerm || filterTag) && (
              <FilterBadge>
                {filteredFlashcards.length} of {flashcards.length}
              </FilterBadge>
            )}
          </h2>
        </div>
        <HeaderActions>
          <ReviewButton 
            due={stats.dueToday > 0}
            onClick={() => navigate('/flashcards/review')}
          >
            Review ({stats.dueToday})
          </ReviewButton>
          <ActionButton primary onClick={() => navigate('/flashcards/create')}>
            Create Flashcard
          </ActionButton>
        </HeaderActions>
      </Header>
      
      <StatsContainer>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Cards</StatLabel>
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
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Search flashcards..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <TagSelect value={filterTag} onChange={handleTagFilterChange}>
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </TagSelect>
        <SortSelect value={sortBy} onChange={handleSortChange}>
          <option value="nextReview">Next Review</option>
          <option value="created">Recently Created</option>
          <option value="reviewed">Most Reviewed</option>
        </SortSelect>
      </FilterContainer>
      
      <FlashcardGrid>
        {filteredFlashcards.map(card => (
          <FlashcardCard key={card._id}>
            <FlashcardQuestion>{card.question}</FlashcardQuestion>
            <FlashcardAnswer>{card.answer}</FlashcardAnswer>
            {card.tags && card.tags.length > 0 && (
              <FlashcardTags>
                {card.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </FlashcardTags>
            )}
            <FlashcardMeta>
              <div>From note: {card.noteReference?.title || 'No note'}</div>
              <div>Next review: {formatDate(card.nextReview)}</div>
              <CardActions>
                <PreviewButton onClick={() => handlePreview(card)}>
                  Preview
                </PreviewButton>
                <ActionButton onClick={() => navigate(`/flashcards/${card._id}`)}>
                  Edit
                </ActionButton>
                <ActionButton danger onClick={() => handleDelete(card._id)}>
                  Delete
                </ActionButton>
              </CardActions>
            </FlashcardMeta>
          </FlashcardCard>
        ))}
      </FlashcardGrid>
      
      {filteredFlashcards.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No flashcards found. {searchTerm || filterTag ? 'Try adjusting your filters.' : ''}
        </div>
      )}

      {previewCard && (
        <Modal onClick={closePreview}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={closePreview}>&times;</CloseButton>
            <h3>Preview Flashcard</h3>
            <div style={{ marginBottom: '20px' }}>
              <strong>Question:</strong>
              <div style={{ marginTop: '10px' }}>{previewCard.question}</div>
            </div>
            {showAnswer ? (
              <div>
                <strong>Answer:</strong>
                <div style={{ marginTop: '10px' }}>{previewCard.answer}</div>
              </div>
            ) : (
              <ActionButton onClick={() => setShowAnswer(true)}>
                Show Answer
              </ActionButton>
            )}
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default FlashcardList;