import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.5-flash";

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function generateWithRetry(prompt) {
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `Sending request to Gemini (attempt ${attempt}/${maxAttempts})...`
      );

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,

        config: {
          responseMimeType: "application/json",

          responseSchema: {
            type: "object",

            properties: {
              cards: {
                type: "array",

                items: {
                  type: "object",

                  properties: {
                    id: {
                      type: "string",
                    },

                    question: {
                      type: "string",
                    },

                    answer: {
                      type: "string",
                    },
                  },

                  required: [
                    "id",
                    "question",
                    "answer",
                  ],
                },
              },
            },

            required: ["cards"],
          },
        },
      });

      console.log("Gemini request succeeded.");

      return response;
    } catch (error) {
      console.error(
        `Gemini attempt ${attempt} failed:`,
        error.status || error.message
      );

      /*
       * 429 means the API quota/rate limit has been reached.
       * Retrying immediately will not solve a quota problem.
       */
      if (error.status === 429) {
        throw error;
      }

      /*
       * Retry only temporary 503 errors.
       */
      if (
        error.status !== 503 ||
        attempt === maxAttempts
      ) {
        throw error;
      }

      const delay = attempt * 3000;

      console.log(
        `Gemini is temporarily busy. Retrying in ${
          delay / 1000
        } seconds...`
      );

      await wait(delay);
    }
  }
}

app.post("/api/generate", async (req, res) => {
  try {
    const { input } = req.body;

    /*
     * Validate user input.
     */
    if (!input || !input.trim()) {
      return res.status(400).json({
        error: "Please provide a topic or notes.",
      });
    }

    /*
     * Prompt sent to Gemini.
     */
    const prompt = `
You are a study assistant.

Generate exactly 5 flashcards based on the user's topic or notes.

Each flashcard must have:
- id
- question
- answer

Questions and answers must be:
- clear
- accurate
- concise
- useful for studying

Return exactly 5 flashcards.

User topic or notes:
${input.trim()}
`;

    /*
     * Call Gemini.
     */
    const response = await generateWithRetry(prompt);

    const text = response.text;

    /*
     * Handle empty AI response.
     */
    if (!text || !text.trim()) {
      return res.status(502).json({
        error: "The AI returned an empty response.",
      });
    }

    let data;

    /*
     * Parse JSON returned by Gemini.
     */
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Gemini returned invalid JSON.");

      return res.status(502).json({
        error:
          "The AI returned invalid JSON. Please try again.",
      });
    }

    /*
     * Validate overall structure.
     */
    if (
      !data ||
      !Array.isArray(data.cards) ||
      data.cards.length !== 5
    ) {
      console.error(
        "Gemini returned an invalid flashcard structure."
      );

      return res.status(502).json({
        error:
          "The AI returned an invalid flashcard structure. Please try again.",
      });
    }

    /*
     * Validate every flashcard.
     */
    for (const card of data.cards) {
      if (
        !card ||
        typeof card.id !== "string" ||
        typeof card.question !== "string" ||
        typeof card.answer !== "string" ||
        !card.id.trim() ||
        !card.question.trim() ||
        !card.answer.trim()
      ) {
        console.error(
          "Gemini returned invalid flashcard data."
        );

        return res.status(502).json({
          error:
            "The AI returned invalid flashcard data. Please try again.",
        });
      }
    }

    /*
     * Send only validated data to React.
     */
    return res.json({
      cards: data.cards,
    });
  } catch (error) {
    console.error("Gemini request failed:", error);

    /*
     * Gemini quota/rate limit.
     */
    if (error.status === 429) {
      return res.status(429).json({
        error:
          "The Gemini API quota has been reached. Please try again later or use an API key with available quota.",
      });
    }

    /*
     * Gemini temporarily unavailable.
     */
    if (error.status === 503) {
      return res.status(503).json({
        error:
          "The AI service is temporarily busy. Please wait a moment and try again.",
      });
    }

    /*
     * Any other unexpected error.
     */
    return res.status(500).json({
      error:
        "Failed to generate flashcards. Please try again.",
    });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(
    `Backend server running on http://localhost:${PORT}`
  );
});