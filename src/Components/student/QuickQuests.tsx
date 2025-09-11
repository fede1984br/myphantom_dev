import React from 'react';
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Skeleton } from "@/Components/ui/skeleton";
import { 
  Play, 
  Star, 
  Lock,
  Calculator,
  BookOpen,
  Microscope,
  Palette,
  Globe,
  Crown
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

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

export default function QuickQuests({ quests, playerProgress, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  const getQuestProgress = (questId) => {
    return playerProgress.find(p => p.quest_id === questId);
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quests.map((quest, index) => {
        const SubjectIcon = subjectIcons[quest.subject] || BookOpen;
        const progress = getQuestProgress(quest.id);
        const isLocked = progress?.status === 'locked' || !progress;
        const isCompleted = progress?.status === 'completed';
        
        return (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: isLocked ? 1 : 1.02 }}
            className={`relative rounded-2xl p-5 border-2 transition-all duration-300 ${
              isLocked 
                ? 'opacity-60 border-gray-200 bg-gray-50' 
                : isCompleted
                  ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                  : 'border-purple-200 bg-white shadow-lg hover:shadow-xl'
            }`}
          >
            {quest.is_boss_quest && (
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3 mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${difficultyColors[quest.difficulty]} text-white shadow-lg`}>
                <SubjectIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">
                  {quest.icon} {quest.title}
                </h3>
                <div className="flex gap-1 mb-2">
                  <Badge variant="secondary" className="text-xs px-2 py-0">
                    {quest.subject}
                  </Badge>
                  {quest.difficulty === 'boss' && (
                    <Badge variant="destructive" className="text-xs px-2 py-0">
                      Boss Quest
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {quest.description}
            </p>
            
            {progress && progress.progress_percentage > 0 && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{progress.progress_percentage}%</span>
                </div>
                <Progress value={progress.progress_percentage} className="h-2" />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                ⏱️ {quest.estimated_time}min
                {quest.rewards?.xp_points && (
                  <span className="ml-2">⭐ {quest.rewards.xp_points}XP</span>
                )}
              </div>
              
              <Button
                disabled={isLocked}
                size="sm"
                className={`${
                  isCompleted 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : isLocked
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                } transition-all duration-200`}
                asChild={!isLocked}
              >
                {isLocked ? (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    Locked
                  </>
                ) : (
                  <Link to={createPageUrl("QuestDetail")}>
                    {isCompleted ? (
                      <>
                        <Star className="w-3 h-3 mr-1" />
                        Review
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        {progress?.status === 'in_progress' ? 'Continue' : 'Start'}
                      </>
                    )}
                  </Link>
                )}
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}