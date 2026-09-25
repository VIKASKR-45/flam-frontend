function PromptInput({ value, onChange, onSubmit, loading }) {
  const characterCount = value.length;

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="study-input">
        What do you want to study?
      </label>

      <textarea
        id="study-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter a topic or paste your study notes..."
        rows={6}
        maxLength={5000}
        disabled={loading}
        aria-describedby="input-help"
      />

      <div className="input-info" id="input-help">
        <span>{characterCount}/5000 characters</span>

        <p>
          Example: React Hooks, JavaScript Arrays, or your own notes.
        </p>
      </div>

      <button
        className="generate-button"
        type="submit"
        disabled={loading || !value.trim()}
      >
        {loading ? "Generating..." : "Generate Flashcards"}
      </button>
    </form>
  );
}

export default PromptInput;