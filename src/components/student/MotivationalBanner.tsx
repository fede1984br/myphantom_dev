import { DailyStreak } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, ThumbsUp, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MotivationalBannerProps {
  streak: DailyStreak;
}


const motivationalMessages = [
  {
    text: "You're doing amazing! Keep up the great work! 🌟",
    icon: Sparkles,
    color: "from-yellow-400 to-orange-500"
  },
  {
    text: "Every quest completed makes you stronger! 💪",
    icon: ThumbsUp,
    color: "from-green-400 to-emerald-500"
  },
  {
    text: "Learning is an adventure - enjoy the journey! 🚀",
    icon: Heart,
    color: "from-pink-400 to-purple-500"
  },
  {
    text: "You're building your superpower through learning! ⚡",
    icon: Smile,
    color: "from-blue-400 to-indigo-500"
  }
];

export default function MotivationalBanner({ streak }: MotivationalBannerProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % motivationalMessages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!showBanner) return null;

  const message = motivationalMessages[currentMessage];
  const IconComponent = message.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentMessage}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Card className={`bg-gradient-to-r ${message.color} border-0 shadow-xl`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-lg">{message.text}</p>
                  {streak?.current_streak > 0 && (
                    <p className="text-sm opacity-90">
                      🔥 You're on a {streak.current_streak} day streak!
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBanner(false)}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}