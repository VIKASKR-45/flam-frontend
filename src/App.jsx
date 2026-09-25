import { useRef, useState } from "react";
import "./App.css";

import PromptInput from "./components/PromptInput";
import FlashcardDeck from "./components/FlashcardDeck";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

import { generateFlashcards } from "./lib/api";
import { validateResult } from "./lib/validateResult";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestIdRef = useRef(0);

  async function generate(inputText) {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await generateFlashcards(inputText);

      const validatedData = validateResult(data);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setResult(validatedData);
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(err.message || "Something went wrong.");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!input.trim() || loading) {
      return;
    }

    await generate(input.trim());
  }

  async function handleRetry() {
    if (!input.trim() || loading) {
      return;
    }

    await generate(input.trim());
  }

  return (
    <main className="app">
      <div className="app-container">

        <header className="app-header">
          <h1>AI Study Assistant</h1>

          <p>
            Turn any topic or study notes into interactive
            flashcards.
          </p>
        </header>

        <section className="input-section">
          <PromptInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </section>

        {loading && <LoadingState />}

        {error && (
          <div className="error-box">
            <ErrorState
              message={error}
              onRetry={handleRetry}
              loading={loading}
            />
          </div>
        )}

        {!loading && !error && !result && (
          <div className="state-message">
            <p>
              Enter a topic or your study notes above to get
              started.
            </p>
          </div>
        )}

        {result && !loading && !error && (
          <section className="flashcard-section">
            <FlashcardDeck cards={result.cards} />
          </section>
        )}

      </div>
    </main>
  );
}

export default App;