import { useState } from "react";

function FlashcardDeck({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({});
  const [retryMode, setRetryMode] = useState(false);

  if (!cards || cards.length === 0) {
    return null;
  }

  const activeCards = retryMode
    ? cards.filter((card) => results[card.id] === false)
    : cards;

  function handleRestart() {
    setResults({});
    setRetryMode(false);
    setCurrentIndex(0);
    setFlipped(false);
  }

  if (activeCards.length === 0 && retryMode) {
    return (
      <div className="state-message">
        <h2>🎉 Great job!</h2>

        <p>You don't have any cards left to practice.</p>

        <div className="deck-actions">
          <button
            type="button"
            onClick={() => {
              setRetryMode(false);
              setCurrentIndex(0);
              setFlipped(false);
            }}
          >
            Back to All Cards
          </button>

          <button type="button" onClick={handleRestart}>
            🔄 Restart Deck
          </button>
        </div>
      </div>
    );
  }

  const currentCard = activeCards[currentIndex];

  function handleAnswer(isCorrect) {
    setResults((previous) => ({
      ...previous,
      [currentCard.id]: isCorrect,
    }));

    setFlipped(false);

    if (currentIndex >= activeCards.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex((index) => index + 1);
    }
  }

  function handleNext() {
    setFlipped(false);

    if (currentIndex >= activeCards.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex((index) => index + 1);
    }
  }

  function handleRetryWrong() {
    const wrongCards = cards.filter(
      (card) => results[card.id] === false
    );

    if (wrongCards.length === 0) {
      return;
    }

    setRetryMode(true);
    setCurrentIndex(0);
    setFlipped(false);
  }

  const knownCount = Object.values(results).filter(
    (value) => value === true
  ).length;

  const unknownCount = Object.values(results).filter(
    (value) => value === false
  ).length;

  return (
    <div className="flashcard-deck">
      <div className="deck-header">
        <p className="card-counter">
          {retryMode
            ? `Retry Mode — Card ${currentIndex + 1} of ${activeCards.length}`
            : `Card ${currentIndex + 1} of ${cards.length}`}
        </p>

        <p className="score-counter">
          ✅ Known: {knownCount}
          &nbsp;&nbsp;
          ❌ Need Practice: {unknownCount}
        </p>
      </div>

      <div
        className="flashcard"
        onClick={() => setFlipped((value) => !value)}
        role="button"
        tabIndex={0}
        aria-label={`Flashcard: ${flipped ? 'Answer' : 'Question'}. Click or press Enter to flip.`}
        aria-expanded={flipped}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setFlipped((value) => !value);
          }
        }}
      >
        <h2 className="card-type">{flipped ? "Answer" : "Question"}</h2>

        <p className="card-text">
          {flipped
            ? currentCard.answer
            : currentCard.question}
        </p>

        <small className="flashcard-hint">
          Click or press space/enter to flip
        </small>
      </div>

      {flipped && (
        <div className="answer-actions">
          <button
            type="button"
            className="btn-know"
            onClick={() => handleAnswer(true)}
          >
            ✅ I Know
          </button>

          <button
            type="button"
            className="btn-dont-know"
            onClick={() => handleAnswer(false)}
          >
            ❌ I Don't Know
          </button>
        </div>
      )}

      <div className="deck-actions">
        <button type="button" onClick={handleNext}>
          Next Card
        </button>

        {unknownCount > 0 && !retryMode && (
          <button type="button" onClick={handleRetryWrong}>
            🔁 Retry Wrong Cards ({unknownCount})
          </button>
        )}

        {retryMode && (
          <button
            type="button"
            onClick={() => {
              setRetryMode(false);
              setCurrentIndex(0);
              setFlipped(false);
            }}
          >
            Back to All Cards
          </button>
        )}

        <button type="button" onClick={handleRestart}>
          🔄 Restart Deck
        </button>
      </div>
    </div>
  );
}

export default FlashcardDeck;
