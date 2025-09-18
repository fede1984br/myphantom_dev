import React, { useState, useEffect } from "react";
import { StudentAchievement } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ArrowLeft, Trophy, Medal, Star, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";

const rarityConfig = {
  common: {
    color: 'from-gray-400 to-gray-600',
    bgColor: 'from-gray-50 to-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200'
  },
  rare: {
    color: 'from-blue-400 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200'
  },
  epic: {
    color: 'from-purple-400 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200'
  },
  legendary: {
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'from-yellow-50 to-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200'
  }
};

export default function Achievements() {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const studentId = "student_001";

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setIsLoading(true);
    const achievementsData = await StudentAchievement.filter({ student_id: studentId }, '-earned_at');
    setAchievements(achievementsData);
    setIsLoading(false);
  };

  const getAchievementsByType = () => {
    const types = {
      quest_master: [],
      streak_keeper: [],
      speed_learner: [],
      perfectionist: [],
      explorer: [],
      boss_slayer: []
    };

    achievements.forEach(achievement => {
      if (types[achievement.achievement_type]) {
        types[achievement.achievement_type].push(achievement);
      }
    });

    return types;
  };

  const achievementTypes = getAchievementsByType();

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/50 rounded mb-4 w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-white/50 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate(createPageUrl("StudentDashboard"))}
            className="bg-white/90 backdrop-blur-sm border-white/30 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              🏆 Achievement Gallery
            </h1>
            <p className="text-white/80 text-lg">
              Your collection of earned badges and accomplishments!
            </p>
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/95 backdrop-blur-xl border-0 text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-purple-600 mb-1">{achievements.length}</div>
              <div className="text-sm text-gray-600">Total Badges</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-xl border-0 text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {achievements.filter(a => a.rarity === 'legendary').length}
              </div>
              <div className="text-sm text-gray-600">Legendary</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-xl border-0 text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {achievements.filter(a => a.rarity === 'epic').length}
              </div>
              <div className="text-sm text-gray-600">Epic</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-xl border-0 text-center">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {achievements.filter(a => a.rarity === 'rare').length}
              </div>
              <div className="text-sm text-gray-600">Rare</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const config = rarityConfig[achievement.rarity] || rarityConfig.common;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Card className={`bg-gradient-to-br ${config.bgColor} ${config.borderColor} border-2 shadow-xl overflow-hidden`}>
                  {/* Rarity indicator */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`bg-gradient-to-r ${config.color} text-white border-0`}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6 text-center">
                    {/* Achievement Icon */}
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${config.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-4xl">{achievement.icon}</span>
                    </div>
                    
                    {/* Achievement Info */}
                    <h3 className={`font-bold text-lg mb-2 ${config.textColor}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm mb-4 ${config.textColor} opacity-80`}>
                      {achievement.description}
                    </p>
                    
                    {/* Earned Date */}
                    {achievement.earned_at && (
                      <div className={`text-xs ${config.textColor} opacity-60`}>
                        Earned {format(new Date(achievement.earned_at), 'MMM d, yyyy')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {achievements.length === 0 && (
          <Card className="bg-white/95 backdrop-blur-xl shadow-xl border-0">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Start Your Achievement Journey!</h3>
              <p className="text-gray-600 mb-6">
                Complete quests and learning activities to earn your first badges!
              </p>
              <Button
                onClick={() => navigate(createPageUrl("QuestMap"))}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}