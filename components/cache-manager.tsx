"use client";

import { useEffect } from "react";
import { DocumentState } from "@/lib/types";

// Simple in-memory cache for TLDR results
const cache = new Map<string, DocumentState>();

interface CacheManagerProps {
  documentId: string;
  data: DocumentState;
  clearOnUnmount?: boolean;
}

export function getCachedData(documentId: string): DocumentState | null {
  return cache.get(documentId) || null;
}

export function setCachedData(documentId: string, data: DocumentState) {
  cache.set(documentId, data);
}

export function CacheManager({
  documentId,
  data,
  clearOnUnmount = false,
}: CacheManagerProps) {
  useEffect(() => {
    // Update cache when data changes
    if (data) {
      setCachedData(documentId, data);
    }

    // Clear cache on unmount if requested
    return () => {
      if (clearOnUnmount) {
        cache.delete(documentId);
      }
    };
  }, [documentId, data, clearOnUnmount]);

  return null;
}

export function clearCache() {
  cache.clear();
}
