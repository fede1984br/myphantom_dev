import React, { useState } from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Bot, RefreshCw, MessageSquare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function PhantomGreeting({ message, streak, onNewMessage }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onNewMessage();
      setIsAnimating(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-gradient-to-r from-purple-500/90 via-blue-500/90 to-pink-500/90 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Animated Phantom Avatar */}
              <motion.div
                animate={{ 
                  rotate: isAnimating ? 360 : 0,
                  scale: isAnimating ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </motion.div>
              
              <div className="text-white">
                <h1 className="text-2xl font-bold mb-1">
                  Hello, Emma! 👋
                </h1>
                <motion.p 
                  key={message}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg text-white/90 font-medium"
                >
                  {message}
                </motion.p>
                {streak?.current_streak > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-white/80">Streak:</span>
                    <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                      <span className="text-orange-300">🔥</span>
                      <span className="font-bold text-white">{streak.current_streak} days</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                className="text-white hover:bg-white/20 transition-colors"
                disabled={isAnimating}
              >
                <RefreshCw className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 transition-colors"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat with Phantom
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}