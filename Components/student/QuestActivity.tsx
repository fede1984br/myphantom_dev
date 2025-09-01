
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, CheckCircle, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

export default function QuestActivity({ activity, onComplete, onStart, isActive, setIsActive }) {
  const [isCompleted, setIsCompleted] = useState(false);

  if (!activity) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Ready to Start!</h3>
          <p className="text-gray-500">Your next activity will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  const handleStart = () => {
    setIsActive(true);
    onStart();
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setIsActive(false);
    setTimeout(() => {
      onComplete();
      setIsCompleted(false);
    }, 1500);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {activity.type === 'video' ? '📺' : 
               activity.type === 'reading' ? '📖' :
               activity.type === 'writing' ? '✏️' :
               activity.type === 'game' ? '🎮' : '📝'}
            </span>
            <span>{activity.title}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => speakText(activity.title + '. ' + activity.content)}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Activity Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed">
              {activity.content}
            </p>
          </div>

          {/* Interactive Elements Based on Activity Type */}
          {activity.type === 'reading' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">📚 Reading Activity</h4>
              <p className="text-blue-700">
                Take your time to read through this carefully. When you're ready, click the complete button below!
              </p>
            </div>
          )}

          {activity.type === 'writing' && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">✍️ Writing Challenge</h4>
              <textarea 
                className="w-full h-32 p-3 border border-green-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Type your answer here..."
              />
            </div>
          )}

          {activity.type === 'video' && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-3">🎬 Video Lesson</h4>
              <div className="aspect-video bg-purple-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-purple-600 mx-auto mb-2" />
                  <p className="text-purple-700">Video content would play here</p>
                </div>
              </div>
            </div>
          )}

          {activity.type === 'game' && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-3">🎮 Interactive Game</h4>
              <div className="aspect-square max-w-sm mx-auto bg-orange-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">🎯</span>
                  <p className="text-orange-700">Game would load here</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            {!isActive && !isCompleted ? (
              <Button 
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Activity
              </Button>
            ) : isActive && !isCompleted ? (
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setIsActive(false)}
                  size="lg"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
                <Button 
                  onClick={handleComplete}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Activity
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-green-600 font-bold text-lg"
              >
                <CheckCircle className="w-6 h-6" />
                Great Job! 🎉
              </motion.div>
            )}
          </div>

          {/* Points Display */}
          {activity.points && (
            <div className="text-center">
              <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
                ⭐ Worth {activity.points} points!
              </Badge>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
