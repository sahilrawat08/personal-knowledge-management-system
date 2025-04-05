# Personal Knowledge Management System

A comprehensive personal knowledge management system built with the MERN stack (MongoDB, Express, React, Node.js). This system helps you organize your notes, create connections between ideas, and implement spaced repetition for effective learning.

## Features

- Create, edit, and organize notes with markdown support
- Link notes together to form a knowledge graph
- Tag and categorize content
- Visualize your knowledge network
- Implement spaced repetition learning with flashcards
- Track your learning progress

## Tech Stack

- **Frontend**: React, React Router, Styled Components, D3.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Additional Tools**: Axios, React Markdown

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pkm-system.git
   cd pkm-system
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/pkm-system
   PORT=5000
   ```

4. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

### Notes Management

- Create new notes with markdown formatting
- Organize notes with tags
- Link related notes together to build your knowledge graph

### Spaced Repetition System

- Create flashcards from your notes
- Review flashcards using a spaced repetition algorithm
- Track your learning progress

### Knowledge Graph

- Visualize the connections between your notes
- Identify relationships and patterns in your knowledge

## Future Enhancements

- User authentication and multi-user support
- Export/import functionality
- Mobile application
- Advanced search capabilities
- API integrations (e.g., with Zotero, Pocket)

## License

This project is licensed under the MIT License - see the LICENSE file for details.