const API_URL = "http://localhost:3001/api/generate";

export async function generateFlashcards(input) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 20000);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
      }),
      signal: controller.signal,
    });

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "The server returned an invalid response."
      );
    }

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Failed to generate flashcards. Please try again."
      );
    }

    if (
      !data ||
      !Array.isArray(data.cards)
    ) {
      throw new Error(
        "The server returned invalid flashcard data."
      );
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "The request took too long. Please try again."
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}