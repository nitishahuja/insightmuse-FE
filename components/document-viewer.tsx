"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/section-card";
import { LoadingMessage } from "@/components/loading-message";
import {
  AlertCircle,
  RefreshCw,
  Upload,
  Sparkles,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";
import {
  CacheManager,
  getCachedData,
  setCachedData,
} from "@/components/cache-manager";
import { motion, AnimatePresence } from "framer-motion";
import { DocumentState, Section } from "@/lib/types";

interface DocumentViewerProps {
  documentState: DocumentState;
  setDocumentState: React.Dispatch<React.SetStateAction<DocumentState | null>>;
}

export function DocumentViewer({
  documentState,
  setDocumentState,
}: DocumentViewerProps) {
  const [pollingCount, setPollingCount] = useState(0);
  const [pollingError, setPollingError] = useState<string | null>(null);

  useEffect(() => {
    if (
      documentState.processing_status === "completed" ||
      documentState.processing_status === "error"
    ) {
      return;
    }

    // Check if we have cached data first
    const cachedData = getCachedData(documentState.document_id);
    if (cachedData && cachedData.processing_status === "completed") {
      setDocumentState({
        ...documentState,
        processing_status: cachedData.processing_status,
        sections: cachedData.sections,
      });
      return;
    }

    const pollTldr = async () => {
      try {
        // Use wait=false for polling to prevent long-hanging requests
        const data = await api.getTLDR(documentState.document_id, false);

        // Cache the response
        setCachedData(documentState.document_id, data);

        setDocumentState({
          ...documentState,
          processing_status: data.processing_status,
          sections: data.sections,
        });

        // Check if all sections are completed
        const allCompleted = data.sections.every(
          (section: Section) => section.status === "completed"
        );
        if (allCompleted) {
          setDocumentState((prev) =>
            prev
              ? {
                  ...prev,
                  processing_status: "completed",
                }
              : null
          );
        } else {
          // Continue polling if not all sections are completed
          setPollingCount((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Polling error:", error);
        setPollingError(
          error instanceof Error
            ? String(error.message)
            : "Failed to fetch TLDR status"
        );
        setDocumentState((prev) =>
          prev
            ? {
                ...prev,
                processing_status: "error",
                error:
                  error instanceof Error
                    ? String(error.message)
                    : "Failed to fetch TLDR status",
              }
            : null
        );
      }
    };

    const timeoutId = setTimeout(pollTldr, 3000);
    return () => clearTimeout(timeoutId);
  }, [documentState, setDocumentState, pollingCount]);

  const handleRetry = () => {
    setPollingError(null);
    setPollingCount(0);
    setDocumentState({
      ...documentState,
      processing_status: "processing",
      error: null,
    });
  };

  const handleReset = () => {
    setDocumentState(null);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#EC4899]" />
            {String(documentState.filename)}
          </h2>
          <p className="text-[#94A3B8]">
            {documentState.sections.length} sections
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleReset}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload New Paper
        </Button>
      </motion.div>

      <AnimatePresence>
        {documentState.processing_status === "processing" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 backdrop-blur-md border-[#6366F1]/20 rounded-xl overflow-hidden">
              <div className="flex items-center">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                    scale: {
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    },
                  }}
                  className="mr-3"
                >
                  <Sparkles className="h-6 w-6 text-[#EC4899]" />
                </motion.div>
                <LoadingMessage />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {documentState.processing_status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-red-500/20 backdrop-blur-md border-red-500/30 rounded-xl">
              <div className="flex items-center">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="mr-3"
                >
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </motion.div>
                <p className="text-red-200 flex-1">
                  {documentState.error
                    ? String(documentState.error)
                    : "Our AI had a coffee break ☕ Try again?"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="ml-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {documentState.sections.map((section, index) => (
          <motion.div key={index} variants={item}>
            <SectionCard section={section} index={index} />
          </motion.div>
        ))}
      </motion.div>

      <CacheManager
        documentId={documentState.document_id}
        data={documentState}
      />
    </div>
  );
}
