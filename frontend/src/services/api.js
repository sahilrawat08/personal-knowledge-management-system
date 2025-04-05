import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Notes API
export const getNotes = () => api.get('/notes');
export const getNote = (id) => api.get(`/notes/${id}`);
export const createNote = (data) => api.post('/notes', data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const getNotesByTag = (tag) => api.get(`/notes/tag/${tag}`);
export const getAllTags = () => api.get('/notes/tags');

// Flashcards API
export const getFlashcards = () => api.get('/flashcards');
export const getDueFlashcards = () => api.get('/flashcards/due');
export const getFlashcard = (id) => api.get(`/flashcards/${id}`);
export const createFlashcard = (data) => api.post('/flashcards', data);
export const updateFlashcard = (id, data) => api.put(`/flashcards/${id}`, data);
export const deleteFlashcard = (id) => api.delete(`/flashcards/${id}`);
export const reviewFlashcard = (id, data) => api.post(`/flashcards/${id}/review`, data);
export const getFlashcardsByNote = (noteId) => api.get(`/flashcards/note/${noteId}`);

// Graph API
export const getGraph = () => api.get('/graph');
export const addLink = (sourceId, targetId) => api.post('/graph/link', { sourceId, targetId });
export const removeLink = (sourceId, targetId) => api.delete('/graph/link', { data: { sourceId, targetId } });

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api; 