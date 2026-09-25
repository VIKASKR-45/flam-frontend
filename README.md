# AI Study Assistant — Interactive Flashcards

A small React application that turns a user's topic or study notes into interactive flashcards using a real Gemini LLM API.

## Features

- Free-form study topic or notes input
- AI-generated flashcards
- Exactly 5 flashcards per generation
- Question → Answer card flipping
- Mark cards as:
  - I Know
  - I Don't Know
- Retry only incorrect cards
- Restart the deck
- Loading state
- Error state with retry
- Empty state
- Input validation
- AI response validation
- Handles malformed AI responses
- Handles API failures and quota errors
- Prevents stale requests from overwriting newer results
- Responsive layout for desktop and mobile

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- React Hooks
- CSS

### Backend

- Node.js
- Express
- Google Gemini API
- `@google/genai`
- dotenv
- CORS

## Project Structure

```text
flam-frontend-assignment/
│
├── server/
│   └── generate.js
│
├── src/
│   ├── components/
│   │   ├── PromptInput.jsx
│   │   ├── ResultView.jsx
│   │   ├── FlashcardDeck.jsx
│   │   ├── ErrorState.jsx
│   │   └── LoadingState.jsx
│   │
│   ├── lib/
│   │   ├── api.js
│   │   └── validateResult.js
│   │
│   ├── types/
│   │   └── result.js
│   │
│   ├── App.jsx
│   └── App.css
│
├── .env
├── .gitignore
├── package.json
└── README.md