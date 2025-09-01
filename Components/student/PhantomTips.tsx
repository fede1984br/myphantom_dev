import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const learningTips = [
  {
    title: "Take Learning Breaks! 🌟",
    content: "Your brain learns better when you take short breaks every 25 minutes. Try the Pomodoro technique!",
    emoji: "🧠"
  },
  {
    title: "Mistakes Are Magic! ✨",
    content: "Every mistake is a chance to learn something new. Don't be afraid to get things wrong - that's how you grow!",
    emoji: "💪"
  },
  {
    title: "Teach Someone Else! 🎓",
    content: "Explaining what you learned to a family member or pet helps you understand it even better!",
    emoji: "🐕"
  },
  {
    title: "Make It Visual! 🎨",
    content: "Draw pictures, create mind maps, or use colors to help remember what you're learning.",
    emoji: "🌈"
  },
  {
    title: "Celebrate Small Wins! 🎉",
    content: "Finished a problem? Understood a concept? Celebrate it! Every step forward counts.",
    emoji: "🏆"
  },
  {
    title: "Stay Curious! 🔍",
    content: "Ask 'Why?' and 'How?' about everything. Curiosity is your superpower for learning!",
    emoji: "🚀"
  }
];

export default function PhantomTips() {
  const [currentTip, setCurrentTip] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showTip) {
        handleNextTip();
      }
    }, 15000); // Change tip every 15 seconds

    return () => clearInterval(interval);
  }, [showTip, currentTip]);

  const handleNextTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % learningTips.length);
      setIsAnimating(false);
    }, 300);
  };

  if (!showTip) {
    return (
      <Card className="bg-white/95 backdrop-blur-xl shadow-xl border-0">
        <CardContent className="p-4 text-center">
          <Button
            variant="outline"
            onClick={() => setShowTip(true)}
            className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Show Learning Tips
          </Button>
        </CardContent>
      </Card>
    );
  }

  const tip = learningTips[currentTip];

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-2 border-purple-200 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            💡 Phantom's Learning Tip
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextTip}
              className="text-white hover:bg-white/20 w-8 h-8"
            >
              <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTip(false)}
              className="text-white hover:bg-white/20 w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{tip.emoji}</div>
              <div className="flex-1">
                <h4 className="font-bold text-purple-800 mb-2">{tip.title}</h4>
                <p className="text-sm text-purple-700 leading-relaxed">{tip.content}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Tip indicator dots */}
        <div className="flex justify-center gap-1 mt-4">
          {learningTips.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTip(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentTip ? 'bg-purple-500' : 'bg-purple-200'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}