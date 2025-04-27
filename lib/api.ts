const API_BASE = "http://127.0.0.1:8000";

// Exponential backoff retry logic
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      // Handle specific error codes
      if (response.status === 404) {
        throw new Error("Document not found");
      } else if (response.status === 408) {
        throw new Error(
          "Request timeout - processing is taking longer than expected"
        );
      } else if (response.status === 400) {
        const data = await response.json();
        throw new Error(data.detail || "Bad request");
      } else if (response.status >= 500) {
        throw new Error("Server error - please try again later");
      }

      throw new Error(`Request failed with status: ${response.status}`);
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        throw error;
      }

      // Exponential backoff
      const delay = Math.min(1000 * 2 ** retries, 10000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Maximum retries exceeded");
}

export const api = {
  uploadPDF: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetchWithRetry(
      `${API_BASE}/upload_pdf`,
      {
        method: "POST",
        body: formData,
      },
      2
    ); // Fewer retries for upload

    return response.json();
  },

  getTLDR: async (documentId: string, wait = true) => {
    const response = await fetchWithRetry(
      `${API_BASE}/tldr?document_id=${documentId}&wait=${wait}`,
      { method: "GET" }
    );

    return response.json();
  },

  askQuestion: async (documentId: string, question: string) => {
    const formData = new FormData();
    formData.append("document_id", documentId);
    formData.append("question", question);

    const response = await fetchWithRetry(`${API_BASE}/qna`, {
      method: "POST",
      body: formData,
    });

    return response.json();
  },
};

// Type definitions for API responses
export interface UploadResponse {
  document_id: string;
  filename: string;
  total_sections: number;
  sections: {
    index: number;
    title: string;
    text: string;
    word_count: number;
    preview: string;
  }[];
}

export interface TLDRResponse {
  document_id: string;
  filename: string;
  processing_status: "processing" | "completed" | "error";
  total_sections: number;
  sections: {
    title: string;
    section_type: string;
    tldr: string | null;
    visualization: string | null;
    status: "pending" | "completed" | "error";
  }[];
}

export interface QnAResponse {
  answer: string;
}
