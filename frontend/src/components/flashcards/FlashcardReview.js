// frontend/src/components/flashcards/FlashcardReview.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const CardContainer = styled.div`
  position: relative;
  perspective: 1500px;
  height: 300px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'rotateY(0)'};
  cursor: pointer;
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const CardBack = styled(CardFace)`
  transform: rotateY(180deg);
`;

const CardContent = styled.div`
  font-size: 18px;
  text-align: center;
  white-space: pre-wrap;
`;

const CardMeta = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 12px;
  color: #666;
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 15px;
`;

const Tag = styled.span`
  background-color: #e0e0e0;
  padding: 3px 8px;
  border-radius: 15px;
  font-size: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    opacity: 0.9;
  }
`;

const RatingButton = styled(Button)`
  background-color: ${props => {
    switch(props.rating) {
      case 0: return '#d32f2f';
      case 1: return '#f44336';
      case 2: return '#ff9800';
      case 3: return '#ffc107';
      case 4: return '#8bc34a';
      case 5: return '#4caf50';
      default: return '#e0e0e0';
    }
  }};
  color: white;
`;

const ActionButton = styled(Button)`
  background-color: ${props => props.primary ? '#4a86e8' : '#e0e0e0'};
  color: ${props => props.primary ? 'white' : '#333'};
`;

const NoCardsMessage = styled.div`
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #4a86e8;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Stat = styled.div`
  text-align: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  flex: 1;
  margin: 0 5px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
`;

const FlashcardReview = () => {
  const navigate = useNavigate();
  const [dueCards, setDueCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [reviewStats, setReviewStats] = useState({
    easy: 0,
    good: 0,
    hard: 0,
    again: 0
  });
  
  useEffect(() => {
    fetchDueCards();
  }, []);
  
  const fetchDueCards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/flashcards/due');
      setDueCards(response.data);
    } catch (error) {
      console.error('Error fetching due cards:', error);
    }
  };
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleRating = async (quality) => {
    if (currentCardIndex < dueCards.length) {
      try {
        const currentCard = dueCards[currentCardIndex];
        await axios.post(`http://localhost:5000/api/flashcards/${currentCard._id}/review`, { quality });
        
        // Update stats
        setReviewedCount(prev => prev + 1);
        if (quality <= 1) {
          setReviewStats(prev => ({ ...prev, again: prev.again + 1 }));
        } else if (quality === 2 || quality === 3) {
          setReviewStats(prev => ({ ...prev, hard: prev.hard + 1 }));
        } else if (quality === 4) {
          setReviewStats(prev => ({ ...prev, good: prev.good + 1 }));
        } else {
          setReviewStats(prev => ({ ...prev, easy: prev.easy + 1 }));
        }
        
        // Move to next card
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentCardIndex(prev => prev + 1);
        }, 300);
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    }
  };
  
  const resetReview = () => {
    setCurrentCardIndex(0);
    setReviewedCount(0);
    setReviewStats({
      easy: 0,
      good: 0,
      hard: 0,
      again: 0
    });
    fetchDueCards();
  };
  
  if (dueCards.length === 0) {
    return (
      <Container>
        <h2>Flashcard Review</h2>
        <NoCardsMessage>
          <h3>No cards due for review!</h3>
          <p>All caught up. Come back later for more reviews.</p>
          <ActionButton primary onClick={() => navigate('/flashcards')}>
            Back to Flashcards
          </ActionButton>
        </NoCardsMessage>
      </Container>
    );
  }
  
  if (currentCardIndex >= dueCards.length) {
    // Review session complete
    return (
      <Container>
        <h2>Review Complete!</h2>
        
        <StatsContainer>
          <Stat>
            <StatValue>{reviewedCount}</StatValue>
            <StatLabel>Cards Reviewed</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{reviewStats.again}</StatValue>
            <StatLabel>Again</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{reviewStats.hard}</StatValue>
            <StatLabel>Hard</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{reviewStats.good}</StatValue>
            <StatLabel>Good</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{reviewStats.easy}</StatValue>
            <StatLabel>Easy</StatLabel>
          </Stat>
        </StatsContainer>
        
        <ButtonGroup>
          <ActionButton onClick={resetReview}>
            Review More Cards
          </ActionButton>
          <ActionButton primary onClick={() => navigate('/flashcards')}>
            Back to Flashcards
          </ActionButton>
        </ButtonGroup>
      </Container>
    );
  }
  
  const currentCard = dueCards[currentCardIndex];
  const progressPercentage = (currentCardIndex / dueCards.length) * 100;
  
  return (
    <Container>
      <h2>Flashcard Review</h2>
      
      <ProgressBar>
        <Progress percentage={progressPercentage} />
      </ProgressBar>
      
      <div>
        {currentCardIndex + 1} of {dueCards.length} cards
      </div>
      
      <CardContainer>
        <Card flipped={isFlipped} onClick={handleFlip}>
          <CardFace>
            <CardMeta>
              From note: {currentCard.noteReference?.title || 'Unknown note'}
            </CardMeta>
            <CardContent>{currentCard.question}</CardContent>
            <CardTags>
              {currentCard.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </CardTags>
          </CardFace>
          <CardBack>
            <CardContent>{currentCard.answer}</CardContent>
          </CardBack>
        </Card>
      </CardContainer>
      
      {isFlipped ? (
        <ButtonGroup>
          <RatingButton rating={0} onClick={() => handleRating(0)}>
            Again
          </RatingButton>
          <RatingButton rating={2} onClick={() => handleRating(2)}>
            Hard
          </RatingButton>
          <RatingButton rating={4} onClick={() => handleRating(4)}>
            Good
          </RatingButton>
          <RatingButton rating={5} onClick={() => handleRating(5)}>
            Easy
          </RatingButton>
        </ButtonGroup>
      ) : (
        <ButtonGroup>
          <ActionButton primary onClick={handleFlip}>
            Show Answer
          </ActionButton>
        </ButtonGroup>
      )}
    </Container>
  );
};

export default FlashcardReview;