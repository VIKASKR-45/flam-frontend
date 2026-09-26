import FlashcardDeck from "./FlashcardDeck";

function ResultView({ cards }) {
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <section className="flashcard-section" aria-label="Flashcards Result">
      <FlashcardDeck cards={cards} />
    </section>
  );
}

export default ResultView;
