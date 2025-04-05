// frontend/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background-color: #333;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <Logo to="/">PKM System</Logo>
      <NavLinks>
        <NavLink to="/">Notes</NavLink>
        <NavLink to="/note/new">New Note</NavLink>
        <NavLink to="/graph">Graph View</NavLink>
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;