import React, { useState, useEffect } from "react";
import { Quest, StudentProgress, DailyStreak, StudentAchievement } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  Trophy, 
  Target,
  BookOpen,
  Calendar,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import PhantomGreeting from "../components/student/PhantomGreeting";
import QuickQuests from "../components/student/QuickQuests";
import PhantomChat from "../components/student/PhantomChat";
import StudentStats from "../components/student/StudentStats";
import TodaysAssignments from "../components/student/TodaysAssignments";
import PhantomTips from "../components/student/PhantomTips";

export default function StudentDashboard() {
  const [quests, setQuests] = useState([]);
  const [playerProgress, setPlayerProgress] = useState([]);
  const [streak, setStreak] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phantomMessage, setPhantomMessage] = useState("");

  const studentId = "student_001";

  useEffect(() => {
    loadDashboardData();
    generatePhantomGreeting();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    const [questsData, progressData, streakData, achievementsData] = await Promise.all([
      Quest.list(),
      StudentProgress.filter({ student_id: studentId }),
      DailyStreak.filter({ student_id: studentId }),
      StudentAchievement.filter({ student_id: studentId }, '-earned_at', 3)
    ]);

    setQuests(questsData);
    setPlayerProgress(progressData);
    setStreak(streakData[0] || null);
    setAchievements(achievementsData);
    setIsLoading(false);
  };

  const generatePhantomGreeting = () => {
    const greetings = [
      "Ready for another amazing learning adventure? 🚀",
      "Your curiosity is your superpower! Let's use it today! ⚡",
      "Every question you ask makes you stronger! What shall we explore? 🌟",
      "I'm here to help you discover incredible things! Let's start! 💫",
      "Your learning journey is unique and special! Ready to continue? 🎯"
    ];
    setPhantomMessage(greetings[Math.floor(Math.random() * greetings.length)]);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Phantom Greeting */}
        <PhantomGreeting 
          message={phantomMessage}
          streak={streak}
          onNewMessage={generatePhantomGreeting}
        />

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-4 gap-6 mt-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Student Stats */}
            <StudentStats 
              streak={streak}
              achievements={achievements}
              isLoading={isLoading}
            />

            {/* Today's Learning Path */}
            <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Target className="w-6 h-6" />
                  🎯 Today's Learning Path
                </CardTitle>
                <p className="text-white/90">Complete these quests to advance your journey!</p>
              </CardHeader>
              <CardContent className="p-6">
                <QuickQuests 
                  quests={quests.slice(0, 3)}
                  playerProgress={playerProgress}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>

            {/* Google Classroom Integration */}
            <TodaysAssignments isLoading={isLoading} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Phantom Assistant */}
            <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="w-5 h-5" />
                  🤖 Phantom Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <PhantomChat compact={true} />
                <Link to={createPageUrl("PhantomChat")} className="block mt-3">
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open Full Chat
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Phantom Tips */}
            <PhantomTips />

            {/* Quick Actions */}
            <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  ⚡ Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  asChild
                >
                  <Link to={createPageUrl("QuestMap")}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Explore Quest Map
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-purple-200 hover:bg-purple-50"
                  asChild
                >
                  <Link to={createPageUrl("Achievements")}>
                    <Trophy className="w-4 h-4 mr-2" />
                    View Achievements
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-200 hover:bg-blue-50"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Today's Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}