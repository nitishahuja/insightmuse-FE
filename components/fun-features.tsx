"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Lightbulb, Coffee, Beaker, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export function FunFeatures() {
  const [activeTab, setActiveTab] = useState("facts");
  const [factIndex, setFactIndex] = useState(0);
  const [jokeIndex, setJokeIndex] = useState(0);
  const [coffeeBreaks, setCoffeeBreaks] = useState(0);

  const scienceFacts = [
    "The average scientific paper is read by only 10 people.",
    "A PhD thesis takes about 500 hours to write on average.",
    "The longest scientific paper ever published was 2,200 pages long.",
    "The most cited scientific paper has over 300,000 citations.",
    "About 2.5 million scientific papers are published each year.",
    "The shortest published paper was just 2 sentences long.",
    "The average length of scientific paper titles has increased by 50% since 1900.",
    "About 90% of all scientists who have ever lived are alive today.",
  ];

  const scienceJokes = [
    "Why did the scientist install a knocker on his door? He wanted to win the No-bell prize!",
    "A neutron walks into a bar and asks, 'How much for a drink?' The bartender says, 'For you, no charge.'",
    "I was reading a book on helium. I couldn't put it down!",
    "What did one ocean say to the other ocean? Nothing, they just waved.",
    "Why can't you trust atoms? They make up everything!",
    "I have a new theory on inertia, but it doesn't seem to be gaining momentum.",
    "What do you call a parade of rabbits hopping backwards? A receding hare-line.",
    "What did the scientist say when he found 2 isotopes of helium? HeHe",
  ];

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#EC4899", "#8B5CF6", "#6366F1"],
    });
  };

  const handleNewFact = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * scienceFacts.length);
    } while (newIndex === factIndex);

    setFactIndex(newIndex);
    triggerConfetti();
  };

  const handleNewJoke = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * scienceJokes.length);
    } while (newIndex === jokeIndex);

    setJokeIndex(newIndex);
    triggerConfetti();
  };

  const handleCoffeeBreak = () => {
    setCoffeeBreaks((prev) => prev + 1);

    // More intense confetti for coffee breaks
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.8 },
      colors: ["#EC4899", "#8B5CF6", "#6366F1", "#FFFFFF"],
    });
  };

  return (
    <motion.div
      className="mt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20 rounded-xl overflow-hidden">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-xl font-bold text-white flex items-center justify-center">
            <Beaker className="h-5 w-5 mr-2 text-[#EC4899]" />
            Fun Science Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs
            defaultValue="facts"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full rounded-none border-b border-white/10 bg-white/5 grid grid-cols-3">
              <TabsTrigger
                value="facts"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#EC4899]/20 data-[state=active]:to-[#8B5CF6]/20 data-[state=active]:text-white text-[#94A3B8]"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Science Facts
              </TabsTrigger>
              <TabsTrigger
                value="jokes"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#EC4899]/20 data-[state=active]:to-[#8B5CF6]/20 data-[state=active]:text-white text-[#94A3B8]"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Science Jokes
              </TabsTrigger>
              <TabsTrigger
                value="coffee"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#EC4899]/20 data-[state=active]:to-[#8B5CF6]/20 data-[state=active]:text-white text-[#94A3B8]"
              >
                <Coffee className="h-4 w-4 mr-2" />
                Coffee Break
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="facts"
              className="p-6 min-h-[200px] flex flex-col items-center justify-between"
            >
              <motion.div
                key={`fact-${factIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
              >
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 5, 0],
                      scale: [1, 1.1, 1, 1.1, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Lightbulb className="h-12 w-12 text-[#EC4899]" />
                  </motion.div>
                </div>
                <p className="text-white text-lg">{scienceFacts[factIndex]}</p>
              </motion.div>

              <Button
                onClick={handleNewFact}
                className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:opacity-90 transition-opacity text-white font-bold"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                New Fact
              </Button>
            </TabsContent>

            <TabsContent
              value="jokes"
              className="p-6 min-h-[200px] flex flex-col items-center justify-between"
            >
              <motion.div
                key={`joke-${jokeIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
              >
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Rocket className="h-12 w-12 text-[#8B5CF6]" />
                  </motion.div>
                </div>
                <p className="text-white text-lg">{scienceJokes[jokeIndex]}</p>
              </motion.div>

              <Button
                onClick={handleNewJoke}
                className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:opacity-90 transition-opacity text-white font-bold"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                New Joke
              </Button>
            </TabsContent>

            <TabsContent
              value="coffee"
              className="p-6 min-h-[200px] flex flex-col items-center justify-between"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
              >
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Coffee className="h-12 w-12 text-[#EC4899]" />
                  </motion.div>
                </div>
                <p className="text-white text-lg">
                  {coffeeBreaks === 0
                    ? "Even AI needs a coffee break sometimes!"
                    : `You've taken ${coffeeBreaks} coffee break${
                        coffeeBreaks > 1 ? "s" : ""
                      }. Productivity increased by ${coffeeBreaks * 25}%!`}
                </p>
              </motion.div>

              <Button
                onClick={handleCoffeeBreak}
                className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:opacity-90 transition-opacity text-white font-bold"
              >
                <Coffee className="h-4 w-4 mr-2" />
                Take a Coffee Break
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
