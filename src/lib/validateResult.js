export function validateResult(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid AI response.");
  }

  if (!Array.isArray(data.cards)) {
    throw new Error(
      "AI response does not contain flashcards."
    );
  }

  if (data.cards.length !== 5) {
    throw new Error(
      "AI response must contain exactly 5 flashcards."
    );
  }

  for (const card of data.cards) {
    if (!card || typeof card !== "object") {
      throw new Error(
        "AI returned an invalid flashcard."
      );
    }

    if (
      typeof card.id !== "string" ||
      typeof card.question !== "string" ||
      typeof card.answer !== "string"
    ) {
      throw new Error(
        "AI returned an invalid flashcard structure."
      );
    }

    if (!card.id.trim()) {
      throw new Error(
        "A flashcard is missing its ID."
      );
    }

    if (!card.question.trim()) {
      throw new Error(
        "A flashcard is missing its question."
      );
    }

    if (!card.answer.trim()) {
      throw new Error(
        "A flashcard is missing its answer."
      );
    }
  }

  return data;
}