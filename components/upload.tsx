"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon, AlertCircle, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LoadingMessage } from "@/components/loading-message";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { DocumentState, Section } from "@/lib/types";

interface UploadProps {
  onUploadStart: () => void;
  onUploadSuccess: (data: DocumentState) => void;
  onUploadError: (error: string) => void;
  isUploading: boolean;
}

export function Upload({
  onUploadStart,
  onUploadSuccess,
  onUploadError,
  isUploading,
}: UploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        setError(
          "Whoa there! We only accept PDFs. Your file is having an identity crisis. 📄"
        );
        onUploadError("Only PDF files are supported.");
        return;
      }

      setError(null);
      onUploadStart();

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 300);

        const data = await api.uploadPDF(file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Trigger confetti on successful upload
        triggerConfetti();

        // Initialize document state with pending sections
        onUploadSuccess({
          ...data,
          processing_status: "processing",
          sections: data.sections.map((section: Section) => ({
            ...section,
            tldr: null,
            visualization: null,
            status: "pending",
          })),
        });
      } catch (error) {
        console.error("Upload error:", error);
        setError(
          error instanceof Error
            ? String(error.message)
            : "Failed to upload file"
        );
        onUploadError(
          error instanceof Error
            ? String(error.message)
            : "Failed to upload file"
        );
        setUploadProgress(0);
      }
    },
    [onUploadStart, onUploadSuccess, onUploadError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-extrabold mb-4 leading-tight">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#EC4899] to-[#8B5CF6]">
            Because Life's Too Short
          </span>
          <span className="block text-white">for Methods Sections</span>
        </h2>
        <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
          Upload a research paper and watch our AI turn academic jargon into
          something you might actually enjoy reading.
        </p>
      </motion.div>

      {isUploading ? (
        <motion.div
          className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Brain className="h-16 w-16 text-[#EC4899] mx-auto mb-4" />
            </motion.div>
            <LoadingMessage />
          </div>
          <Progress
            value={uploadProgress}
            className="h-3 mb-2 bg-white/20"
            indicatorClassName="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6]"
          />
          <p className="text-sm text-center text-[#94A3B8]">
            {uploadProgress}% uploaded
          </p>
        </motion.div>
      ) : (
        <motion.div
          onClick={getRootProps().onClick}
          onKeyDown={getRootProps().onKeyDown}
          onFocus={getRootProps().onFocus}
          onBlur={getRootProps().onBlur}
          className={`bg-white/10 backdrop-blur-md p-8 rounded-2xl border-2 border-dashed ${
            isDragActive
              ? "border-[#EC4899] bg-[#EC4899]/10"
              : "border-white/20"
          } transition-all duration-300 cursor-pointer hover:border-[#EC4899] hover:bg-[#EC4899]/5 shadow-xl`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <UploadIcon className="h-16 w-16 text-[#EC4899] mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">
              {isDragActive
                ? "Drop that knowledge bomb here!"
                : "Drag & drop your research paper"}
            </h3>
            <p className="text-[#94A3B8] mb-6">or click to browse files</p>
            <div className="flex justify-center">
              <Button className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:opacity-90 transition-opacity text-white font-bold py-6 px-8 rounded-xl text-lg shadow-lg shadow-[#EC4899]/20 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Select PDF File
              </Button>
            </div>
            <p className="text-xs text-[#94A3B8] mt-6">
              Only PDF files are supported (we're not savages)
            </p>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="mt-4 p-4 bg-red-500/20 backdrop-blur-md rounded-xl border border-red-500/30 flex items-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{String(error)}</p>
        </motion.div>
      )}
    </div>
  );
}

export type { DocumentState };
