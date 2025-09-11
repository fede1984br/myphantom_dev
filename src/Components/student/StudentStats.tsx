import React from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Skeleton } from "@/Components/ui/skeleton";
import { 
  Flame, 
  Star, 
  Trophy, 
  Zap, 
  Target,
  Crown,
  Medal
} from "lucide-react";
import { motion } from "framer-motion";

export default function StudentStats({ streak, achievements, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/95 backdrop-blur-xl">
            <CardContent className="p-4">
              <Skeleton className="h-12 w-12 rounded-2xl mb-3" />
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const level = streak?.level || 1;
  const currentXP = streak?.total_xp || 0;
  const xpForNextLevel = level * 100;
  const xpProgress = ((currentXP % 100) / 100) * 100;

  const stats = [
    {
      icon: Crown,
      label: "Level",
      value: level,
      subtext: `${100 - (currentXP % 100)} XP to next level`,
      gradient: "from-yellow-400 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50",
      textColor: "text-yellow-700"
    },
    {
      icon: Flame,
      label: "Learning Streak",
      value: `${streak?.current_streak || 0}`,
      subtext: "days in a row!",
      gradient: "from-orange-400 to-red-500",
      bgGradient: "from-orange-50 to-red-50", 
      textColor: "text-orange-700"
    },
    {
      icon: Zap,
      label: "XP Points",
      value: currentXP,
      subtext: "total earned",
      gradient: "from-blue-400 to-purple-500",
      bgGradient: "from-blue-50 to-purple-50",
      textColor: "text-blue-700"
    },
    {
      icon: Trophy,
      label: "Achievements",
      value: achievements.length,
      subtext: "badges earned",
      gradient: "from-green-400 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      textColor: "text-green-700"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Level Progress Bar */}
      <Card className="bg-white/95 backdrop-blur-xl shadow-xl border-0 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Level {level} Scholar</h3>
                <p className="text-sm text-gray-600">Keep learning to level up!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">{currentXP % 100}/100</div>
              <div className="text-xs text-gray-500">XP</div>
            </div>
          </div>
          <Progress 
            value={xpProgress} 
            className="h-3 bg-gray-100"
          />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className={`bg-gradient-to-br ${stat.bgGradient} border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className={`text-xs font-semibold ${stat.textColor} opacity-80 mb-1`}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                  {stat.value}
                </p>
                <p className={`text-xs ${stat.textColor} opacity-70`}>
                  {stat.subtext}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}