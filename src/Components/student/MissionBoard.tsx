import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Skeleton } from "@/Components/ui/skeleton";
import { 
  Map, 
  Play, 
  Lock, 
  Crown, 
  Star,
  BookOpen,
  Calculator,
  Microscope,
  Palette,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";

const subjectIcons = {
  mathematics: Calculator,
  english: BookOpen,
  science: Microscope,
  history: Globe,
  art: Palette
};

const difficultyColors = {
  beginner: 'from-green-400 to-green-600',
  intermediate: 'from-blue-400 to-blue-600',
  advanced: 'from-purple-400 to-purple-600',
  boss: 'from-red-500 to-pink-600'
};

const QuestCard = ({ quest, progress, onStart }) => {
  const SubjectIcon = subjectIcons[quest.subject] || BookOpen;
  const isLocked = progress?.status === 'locked' || !progress;
  const isCompleted = progress?.status === 'completed';
  const isAvailable = progress?.status === 'available' || progress?.status === 'in_progress';
  
  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.05 }}
      whileTap={{ scale: isLocked ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`relative overflow-hidden border-2 transition-all duration-300 ${
        isLocked 
          ? 'opacity-60 border-gray-300 bg-gray-100' 
          : isCompleted 
            ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
            : 'border-purple-300 bg-white hover:shadow-xl'
      }`}>
        {quest.is_boss_quest && (
          <div className="absolute top-2 right-2">
            <Crown className="w-6 h-6 text-yellow-500" />
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${difficultyColors[quest.difficulty]} text-white shadow-lg`}>
              <SubjectIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg text-gray-800 line-clamp-2">
                {quest.icon} {quest.title}
              </CardTitle>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {quest.subject}
                </Badge>
                <Badge variant={quest.difficulty === 'boss' ? 'destructive' : 'outline'} className="text-xs">
                  {quest.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {quest.description}
          </p>
          
          {progress && progress.progress_percentage > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{progress.progress_percentage}%</span>
              </div>
              <Progress value={progress.progress_percentage} className="h-2" />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              ⏱️ {quest.estimated_time}min
              {quest.rewards?.xp_points && (
                <span className="ml-2">⭐ {quest.rewards.xp_points}XP</span>
              )}
            </div>
            
            <Button
              onClick={() => onStart(quest)}
              disabled={isLocked}
              variant={isCompleted ? "outline" : "default"}
              size="sm"
              className={`${
                isCompleted 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : isLocked
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
              } transition-all duration-200`}
            >
              {isLocked ? (
                <>
                  <Lock className="w-4 h-4 mr-1" />
                  Locked
                </>
              ) : isCompleted ? (
                <>
                  <Star className="w-4 h-4 mr-1" />
                  Complete
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  {progress?.status === 'in_progress' ? 'Continue' : 'Start'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function MissionBoard({ quests, playerProgress, onQuestComplete, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleQuestStart = (quest) => {
    // In a real app, this would navigate to the quest detail page
    console.log('Starting quest:', quest.title);
    // For demo purposes, trigger completion animation
    if (Math.random() > 0.5) {
      onQuestComplete();
    }
  };

  const getQuestProgress = (questId) => {
    return playerProgress.find(p => p.quest_id === questId);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Map className="w-8 h-8" />
          🗺️ Adventure Map
        </CardTitle>
        <p className="text-indigo-100">Choose your next learning quest!</p>
      </CardHeader>
      
      <CardContent className="p-6">
        {quests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Ready for Adventure!</h3>
            <p className="text-gray-500">Your learning quests will appear here soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                progress={getQuestProgress(quest.id)}
                onStart={handleQuestStart}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}