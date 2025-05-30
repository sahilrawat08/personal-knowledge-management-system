# Personal Knowledge Management System

A full-stack application for managing personal knowledge through notes and flashcards with spaced repetition learning.

## Features

- Note taking with Markdown support
- Flashcard creation and spaced repetition review
- Knowledge graph visualization
- Cross-linking between notes
- Tag-based organization

## Tech Stack

### Frontend
- React 18
- React Router 6
- Styled Components
- D3.js for visualizations
- Axios for API calls

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pkm-system.git
cd pkm-system
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# In backend directory
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

The frontend will be available at http://localhost:3000
The backend API will be available at http://localhost:5000

## Development

### Available Scripts

Backend:
- `npm start`: Start production server
- `npm run dev`: Start development server with hot reload
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

Frontend:
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Project Structure

```
pkm-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- React team for the amazing frontend library
- MongoDB team for the powerful database
- All contributors who have helped with the project