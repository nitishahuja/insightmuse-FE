import React, { useState } from "react";

export const ChatSection: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    setError(
      err instanceof Error ? String(err.message) : "Failed to fetch response"
    );
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      {/* ... rest of the component ... */}
    </div>
  );
};
