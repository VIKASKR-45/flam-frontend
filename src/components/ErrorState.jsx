function ErrorState({ message, onRetry, loading }) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>

      <p>{message}</p>

      <button
        className="retry-button"
        onClick={onRetry}
        disabled={loading}
      >
        {loading ? "Trying again..." : "Try Again"}
      </button>
    </div>
  );
}

export default ErrorState;