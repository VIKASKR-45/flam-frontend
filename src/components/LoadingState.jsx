function LoadingState() {
  return (
    <div
      className="loading-state"
      role="status"
      aria-live="polite"
    >
      <p>Generating your flashcards...</p>
      <p>Please wait a moment.</p>
    </div>
  );
}

export default LoadingState;