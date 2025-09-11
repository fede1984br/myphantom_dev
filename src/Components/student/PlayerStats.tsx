import React from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Skeleton } from "@/Components/ui/skeleton";
import { Flame, Star, Trophy, Crown, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function PlayerStats({ streak, achievements, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/90">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-6 mb-2" />
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-6 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const level = streak?.level || 1;
  const xpForNextLevel = level * 100;
  const currentXP = streak?.total_xp || 0;
  const xpProgress = ((currentXP % 100) / 100) * 100;

  const stats = [
    {
      icon: Flame,
      label: "Streak",
      value: `${streak?.current_streak || 0} days`,
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      icon: Star,
      label: "Level",
      value: level,
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50", 
      textColor: "text-yellow-700"
    },
    {
      icon: Zap,
      label: "XP Points",
      value: currentXP,
      color: "from-blue-400 to-purple-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      icon: Trophy,
      label: "Badges",
      value: achievements.length,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Level Progress Bar */}
      <Card className="bg-white/90 backdrop-blur-sm border-2 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-800">Level {level} Adventurer</span>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              {currentXP % 100}/100 XP
            </Badge>
          </div>
          <Progress 
            value={xpProgress} 
            className="h-3 bg-yellow-100"
          />
          <p className="text-xs text-yellow-700 mt-1">
            {100 - (currentXP % 100)} XP to next level!
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className={`${stat.bgColor} border-2 border-opacity-50 hover:shadow-lg transition-all duration-300`}>
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className={`text-xs font-medium ${stat.textColor} opacity-80`}>
                  {stat.label}
                </p>
                <p className={`text-xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}