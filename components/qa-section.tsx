"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Send, MessageSquare, Brain } from "lucide-react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface QASectionProps {
  documentId: string;
}

interface QAItem {
  question: string;
  answer: string;
  isLoading?: boolean;
  error?: string;
}

export function QASection({ documentId }: QASectionProps) {
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState<QAItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isSubmitting) return;

    const newQuestion = question;
    setQuestion("");
    setIsSubmitting(true);

    try {
      // Add question to history with loading state
      setQaHistory((prev) => [
        ...prev,
        { question: newQuestion, answer: "", isLoading: true },
      ]);

      const data = await api.askQuestion(documentId, newQuestion);

      // Update the answer in history
      setQaHistory((prev) =>
        prev.map((item, index) =>
          index === prev.length - 1
            ? { question: item.question, answer: data.answer, isLoading: false }
            : item
        )
      );
    } catch (error) {
      console.error("QA error:", error);
      // Update with error
      setError(
        error instanceof Error
          ? String(error.message)
          : "Failed to fetch answer"
      );
      setQaHistory((prev) =>
        prev.map((item, index) =>
          index === prev.length - 1
            ? {
                question: item.question,
                answer: "",
                isLoading: false,
                error:
                  error instanceof Error
                    ? String(error.message)
                    : "Failed to fetch answer",
              }
            : item
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-8 bg-white/10 backdrop-blur-md border-white/20 rounded-xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-white/10">
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <Brain className="h-5 w-5 mr-2 text-[#EC4899]" />
          Ask Questions About This Paper
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <AnimatePresence>
            {qaHistory.length > 0 && (
              <motion.div
                className="space-y-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {qaHistory.map((item, index) => (
                  <motion.div
                    key={index}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-[#EC4899]/20 p-4 rounded-xl rounded-bl-none border border-[#EC4899]/30">
                      <p className="text-white flex items-start">
                        <MessageSquare className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-[#EC4899]" />
                        <span>{item.question}</span>
                      </p>
                    </div>

                    {item.isLoading ? (
                      <div className="bg-[#8B5CF6]/20 p-4 rounded-xl rounded-tr-none border border-[#8B5CF6]/30">
                        <div className="flex space-x-2 items-center">
                          <div
                            className="h-2 w-2 bg-[#8B5CF6] rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="h-2 w-2 bg-[#8B5CF6] rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="h-2 w-2 bg-[#8B5CF6] rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    ) : item.error ? (
                      <div className="bg-red-500/20 p-4 rounded-xl rounded-tr-none border border-red-500/30 flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-200">{item.error}</p>
                      </div>
                    ) : (
                      <div className="bg-[#8B5CF6]/20 p-4 rounded-xl rounded-tr-none border border-[#8B5CF6]/30">
                        <p className="text-white flex items-start">
                          <Brain className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-[#8B5CF6]" />
                          <span>{item.answer}</span>
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <Textarea
              placeholder="Ask a question about this paper..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[80px] resize-none bg-white/5 border-white/20 text-white placeholder:text-[#94A3B8] focus-visible:ring-[#EC4899] focus-visible:ring-offset-0 focus-visible:border-[#EC4899]"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!question.trim() || isSubmitting}
                className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:opacity-90 transition-opacity text-white font-bold"
              >
                <Send className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
