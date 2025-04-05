// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navigation from './components/layout/Navigation';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import NoteList from './components/notes/NoteList';
import NoteView from './components/notes/NoteView';
import CreateNote from './components/notes/CreateNote';
import FlashcardList from './components/flashcards/FlashcardList';
import CreateFlashcard from './components/flashcards/CreateFlashcard';
import GraphView from './components/notes/GraphView';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';

const theme = {
  colors: {
    primary: '#2196f3',
    secondary: '#1976d2',
    error: '#d32f2f',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: {
      primary: '#333333',
      secondary: '#666666',
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px'
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.1)'
  }
};

const AuthenticatedLayout = ({ children }) => {
  return (
    <>
      <Navigation />
      <div style={{ paddingTop: '64px' }}>
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NoteList />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/notes" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NoteList />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/notes/new" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <CreateNote />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/notes/:id" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NoteView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/flashcards" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <FlashcardList />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/flashcards/new" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <CreateFlashcard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/flashcards/review" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <div>Review feature coming soon...</div>
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/graph" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <GraphView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;