"use client";

import { useState } from "react";
import { Upload, type DocumentState } from "@/components/upload";
import { DocumentViewer } from "@/components/document-viewer";
import { QASection } from "@/components/qa-section";
import { Header } from "@/components/header";
import { ErrorBoundary } from "@/components/error-boundary";
import { BackgroundAnimation } from "@/components/background-animation";
import { motion } from "framer-motion";
import { FunFeatures } from "@/components/fun-features";

export default function Home() {
  const [documentState, setDocumentState] = useState<DocumentState | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = (data: DocumentState) => {
    setDocumentState(data);
    setIsUploading(false);
  };

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
    setIsUploading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white relative overflow-hidden">
      <BackgroundAnimation />
      <div className="relative z-10">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <ErrorBoundary>
            {!documentState ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Upload
                  onUploadStart={handleUploadStart}
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                  isUploading={isUploading}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <DocumentViewer
                  documentState={documentState}
                  setDocumentState={setDocumentState}
                />
                <QASection documentId={documentState.document_id} />
              </motion.div>
            )}
          </ErrorBoundary>

          {!documentState && <FunFeatures />}
        </div>
      </div>
    </main>
  );
}
