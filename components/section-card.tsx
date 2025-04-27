"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Sparkles, FileText, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionType, TLDR } from "@/lib/types";

interface SectionCardProps {
  section: Section;
  index: number;
}

export function SectionCard({ section, index }: SectionCardProps) {
  const { title, section_type, tldr, visualization, status } = section;

  const renderTLDR = () => {
    if (status === "completed" && tldr) {
      return (
        <motion.div
          className="prose prose-sm max-w-none prose-invert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-white">{tldr.tldr}</p>
          {tldr.visualization && tldr.visualization.viz_type !== "NONE" && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-white/80">
                Visualization Explanation
              </h4>
              <p className="text-sm text-white/60">
                {tldr.visualization.explanation}
              </p>
              {/* Render visualization based on type */}
              {/* This would be implemented based on your visualization requirements */}
            </div>
          )}
        </motion.div>
      );
    } else if (status === "pending") {
      return (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full bg-white/10" />
          <Skeleton className="h-4 w-[90%] bg-white/10" />
          <Skeleton className="h-4 w-[80%] bg-white/10" />
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-400">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="text-sm">Failed to generate summary</p>
        </div>
      );
    }
  };

  const getIconForSection = (type: SectionType) => {
    switch (type) {
      case "methodology":
        return <FileText className="h-5 w-5 mr-2 text-[#EC4899]" />;
      case "results":
        return <Sparkles className="h-5 w-5 mr-2 text-[#8B5CF6]" />;
      case "discussion":
        return <Zap className="h-5 w-5 mr-2 text-[#6366F1]" />;
      default:
        return <FileText className="h-5 w-5 mr-2 text-[#EC4899]" />;
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-xl bg-white/10 backdrop-blur-md border-white/20 rounded-xl">
      <CardHeader className="border-b border-white/10 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center">
            {getIconForSection(section_type)}
            {String(title)}
          </CardTitle>
          <Badge variant={getBadgeVariant(status)}>
            {status === "completed"
              ? "Summarized"
              : status === "pending"
              ? "Processing"
              : "Error"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="tldr" className="w-full">
          <TabsList className="w-full rounded-none border-b border-white/20 bg-white/5">
            <TabsTrigger
              value="tldr"
              className="flex-1 data-[state=active]:bg-[#EC4899] data-[state=active]:bg-opacity-20 data-[state=active]:text-white text-white/60 hover:text-white transition-colors"
            >
              <Zap className="h-4 w-4 mr-2" />
              TL;DR
            </TabsTrigger>
            {visualization && (
              <TabsTrigger
                value="visualization"
                className="flex-1 data-[state=active]:bg-[#EC4899] data-[state=active]:bg-opacity-20 data-[state=active]:text-white text-white/60 hover:text-white transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Visualization
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="tldr" className="p-6 min-h-[100px] bg-black/20">
            {renderTLDR()}
          </TabsContent>
          {visualization && (
            <TabsContent value="visualization" className="p-6 bg-black/20">
              <img
                src={visualization}
                alt="Section visualization"
                className="w-full h-auto rounded-lg"
              />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
