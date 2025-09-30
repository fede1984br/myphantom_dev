import { PlayerProgress } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, ThumbsUp, Smile, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MotivationalMessagesProps {
  progress: PlayerProgress;
}

const getMotivationalMessage = (progress: PlayerProgress) => {
  if (progress.progress_percentage >= 90) {
    return {
      text: "You're almost there! You're doing incredible! 🌟",
      icon: Star,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50"
    };
  } else if (progress.progress_percentage >= 70) {
    return {
      text: "Fantastic progress! Keep up the great work! 💪",
      icon: ThumbsUp,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    };
  } else if (progress.progress_percentage >= 50) {
    return {
      text: "You're doing great! Every step counts! ⚡",
      icon: Zap,
      color: "from-blue-400 to-purple-500",
      bgColor: "from-blue-50 to-purple-50"
    };
  } else if (progress.progress_percentage >= 25) {
    return {
      text: "Nice start! You've got this! 🚀",
      icon: Smile,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    };
  } else {
    return {
      text: "Welcome, adventurer! Ready to learn? 🎯",
      icon: Heart,
      color: "from-pink-400 to-red-500",
      bgColor: "from-pink-50 to-red-50"
    };
  }
};

const encouragingTips = [
  "💡 Take breaks when you need them - learning is a journey!",
  "🌱 Making mistakes helps you grow stronger!",
  "🎈 You're braver than you believe and stronger than you seem!",
  "⭐ Every expert was once a beginner - you're on your way!",
  "🦋 Progress, not perfection - you're doing amazing!"
];

export default function MotivationalMessages({ progress }: MotivationalMessagesProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % encouragingTips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const message = getMotivationalMessage(progress);
  const IconComponent = message.icon;

  return (
    <div className="space-y-4">
      {/* Main Motivational Message */}
      <Card className={`bg-gradient-to-r ${message.bgColor} border-2 border-opacity-50 shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${message.color} flex items-center justify-center shadow-lg`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">
                {message.text}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rotating Tips */}
      {showTip && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-800 flex items-center justify-between">
                  💙 Encouraging Tip
                  <button 
                    onClick={() => setShowTip(false)}
                    className="text-blue-400 hover:text-blue-600 text-lg leading-none"
                  >
                    ×
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-blue-700 leading-relaxed">
                  {encouragingTips[currentTip]}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Anxiety Support */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 border-opacity-50">
        <CardContent className="p-3">
          <div className="text-center">
            <p className="text-xs text-green-700 mb-2 font-medium">
              Feeling overwhelmed? 🫂
            </p>
            <div className="flex justify-center gap-2">
              <button className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-full text-xs transition-colors">
                Take a Break
              </button>
              <button className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-xs transition-colors">
                Deep Breathing
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}