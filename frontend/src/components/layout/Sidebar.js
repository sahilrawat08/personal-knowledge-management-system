// frontend/src/components/layout/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SidebarSection = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SidebarTitle = styled.h3`
  margin: 0;
  padding: 0 20px 10px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.6);
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  text-decoration: none;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const TagList = styled.div`
  margin-top: 10px;
`;

const Tag = styled(Link)`
  display: inline-block;
  margin: 5px;
  padding: 3px 8px;
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  font-size: 12px;
  text-decoration: none;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Counter = styled.span`
  margin-left: auto;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
`;

const Sidebar = () => {
  const location = useLocation();
  const [tags, setTags] = useState([]);
  const [dueCards, setDueCards] = useState(0);
  
  useEffect(() => {
    fetchTags();
    fetchDueCardsCount();
  }, []);
  
  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notes');
      const allTags = new Set();
      
      response.data.forEach(note => {
        note.tags.forEach(tag => allTags.add(tag));
      });
      
      setTags(Array.from(allTags));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };
  
  const fetchDueCardsCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/flashcards/due');
      setDueCards(response.data.length);
    } catch (error) {
      console.error('Error fetching due cards count:', error);
    }
  };
  
  return (
    <SidebarContainer>
      <SidebarSection>
        <SidebarTitle>Notes</SidebarTitle>
        <NavLink to="/notes" active={location.pathname === '/notes' || location.pathname === '/'}>
          All Notes
        </NavLink>
        <NavLink to="/notes/new" active={location.pathname === '/notes/new'}>
          New Note
        </NavLink>
        <NavLink to="/graph" active={location.pathname === '/graph'}>
          Knowledge Graph
        </NavLink>
      </SidebarSection>
      
      <SidebarSection>
        <SidebarTitle>Flashcards</SidebarTitle>
        <NavLink to="/flashcards" active={location.pathname === '/flashcards'}>
          All Flashcards
        </NavLink>
        <NavLink to="/flashcards/review" active={location.pathname === '/flashcards/review'}>
          Review 
          {dueCards > 0 && <Counter>{dueCards}</Counter>}
        </NavLink>
        <NavLink to="/flashcards/create" active={location.pathname === '/flashcards/create'}>
          Create Flashcard
        </NavLink>
      </SidebarSection>
      
      <SidebarSection>
        <SidebarTitle>Tags</SidebarTitle>
        <TagList>
          {tags.map(tag => (
            <Tag key={tag} to={`/notes?tag=${tag}`}>
              {tag}
            </Tag>
          ))}
        </TagList>
      </SidebarSection>
    </SidebarContainer>
  );
};

export default Sidebar;