// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Layout components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Note components
import NotesList from './components/notes/NotesList';
import NoteEditor from './components/notes/NoteEditor';
import NoteView from './components/notes/NoteView';
import GraphView from './components/notes/GraphView';

// Flashcard components
import FlashcardList from './components/flashcards/FlashcardList';
import CreateFlashcard from './components/flashcards/CreateFlashcard';
import FlashcardReview from './components/flashcards/FlashcardReview';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  overflow-y: auto;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Navbar />
        <MainContent>
          <Sidebar />
          <ContentArea>
            <Routes>
              {/* Note Routes */}
              <Route path="/" element={<NotesList />} />
              <Route path="/notes" element={<NotesList />} />
              <Route path="/notes/new" element={<NoteEditor />} />
              <Route path="/notes/edit/:id" element={<NoteEditor />} />
              <Route path="/notes/:id" element={<NoteView />} />
              <Route path="/graph" element={<GraphView />} />
              
              {/* Flashcard Routes */}
              <Route path="/flashcards" element={<FlashcardList />} />
              <Route path="/flashcards/create" element={<CreateFlashcard />} />
              <Route path="/flashcards/create/:noteId" element={<CreateFlashcard />} />
              <Route path="/flashcards/review" element={<FlashcardReview />} />
            </Routes>
          </ContentArea>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;