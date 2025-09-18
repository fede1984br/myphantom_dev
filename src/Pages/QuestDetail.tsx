import React, { useState, useEffect } from "react";
import { Quest, StudentProgress } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { Badge } from "@/Components/ui/badge";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  CheckCircle,
  HelpCircle,
  Star,
  Timer,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import QuestActivity from "../Components/student/QuestActivity";
import QuizComponent from "../Components/student/QuizComponent";
import MotivationalMessages from "../Components/student/MotivationalMessages";

export default function QuestDetail() {
  const navigate = useNavigate();
  const [quest, setQuest] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Mock quest ID - in real app would come from URL params
  const questId = "quest_001";
  const studentId = "student_001";

  useEffect(() => {
    loadQuestData();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeSpent(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const loadQuestData = async () => {
    setIsLoading(true);
    const [questData, progressData] = await Promise.all([
      Quest.get(questId),
      StudentProgress.filter({ student_id: studentId, quest_id: questId })
    ]);
    
    setQuest(questData);
    setProgress(progressData[0] || null);
    setIsLoading(false);
  };

  const handleActivityComplete = async () => {
    if (!quest || !quest.content?.activities) return;

    const nextActivity = currentActivity + 1;
    const totalActivities = quest.content.activities.length;
    const newProgress = Math.round((nextActivity / totalActivities) * 100);

    // Update progress
    if (progress) {
      await StudentProgress.update(progress.id, {
        progress_percentage: newProgress,
        activities_completed: [...(progress.activities_completed || []), `activity_${currentActivity}`],
        status: newProgress === 100 ? 'completed' : 'in_progress',
        time_spent: (progress.time_spent || 0) + timeSpent
      });
    }

    if (nextActivity >= totalActivities) {
      // Quest completed!
      setIsActive(false);
      // Show completion celebration
    } else {
      setCurrentActivity(nextActivity);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white bg-opacity-50 rounded mb-4 w-48"></div>
            <div className="h-64 bg-white bg-opacity-50 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 p-4 flex items-center justify-center">
        <Card className="bg-white/90 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quest Not Found</h2>
          <Button onClick={() => navigate(createPageUrl("StudentDashboard"))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const currentActivityData = quest.content?.activities?.[currentActivity];
  const totalActivities = quest.content?.activities?.length || 0;
  const progressPercentage = totalActivities > 0 ? Math.round(((currentActivity + 1) / totalActivities) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate(createPageUrl("StudentDashboard"))}
            className="bg-white/90"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              {quest.icon} {quest.title}
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <Badge className="bg-white/20 text-white border-white/30">
                {quest.subject}
              </Badge>
              <div className="flex items-center gap-1 text-white/90 text-sm">
                <Timer className="w-4 h-4" />
                {formatTime(timeSpent)}
              </div>
              <div className="flex items-center gap-1 text-white/90 text-sm">
                <Target className="w-4 h-4" />
                Activity {currentActivity + 1} of {totalActivities}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="bg-white/90 backdrop-blur-sm mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800">Quest Progress</span>
              <span className="text-2xl font-bold text-purple-600">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-gray-200" />
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentActivity}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {currentActivityData?.type === 'quiz' ? (
                  <QuizComponent 
                    activity={currentActivityData}
                    onComplete={handleActivityComplete}
                    onStart={() => setIsActive(true)}
                  />
                ) : (
                  <QuestActivity 
                    activity={currentActivityData}
                    onComplete={handleActivityComplete}
                    onStart={() => setIsActive(true)}
                    isActive={isActive}
                    setIsActive={setIsActive}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <MotivationalMessages progress={progressPercentage} />
            
            {/* Quest Info */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Quest Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quest.rewards?.xp_points && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">XP Points</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        +{quest.rewards.xp_points} XP
                      </Badge>
                    </div>
                  )}
                  {quest.rewards?.coins && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Gold Coins</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        +{quest.rewards.coins} 🪙
                      </Badge>
                    </div>
                  )}
                  {quest.rewards?.badges && quest.rewards.badges.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600">Badges</span>
                      <div className="flex gap-1 mt-1">
                        {quest.rewards.badges.map((badge, index) => (
                          <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                            🏆 {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Help Button */}
            <Button
              className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
              size="lg"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              🆘 Need Help?
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}