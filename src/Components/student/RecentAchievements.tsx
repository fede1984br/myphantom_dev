import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const rarityColors = {
  common: 'bg-gray-100 text-gray-800 border-gray-200',
  rare: 'bg-blue-100 text-blue-800 border-blue-200',
  epic: 'bg-purple-100 text-purple-800 border-purple-200',
  legendary: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-400'
};

export default function RecentAchievements({ achievements, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-yellow-200">
      <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5" />
          🏆 Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {achievements.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">🎖️</div>
              <p className="text-sm text-gray-500">Complete quests to earn badges!</p>
            </div>
          ) : (
            achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 border border-yellow-100 rounded-lg hover:border-yellow-300 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-lg">{achievement.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-800 text-sm truncate">
                      {achievement.title}
                    </h4>
                    <Badge variant="outline" className={rarityColors[achievement.rarity]}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {achievement.earned_at && format(new Date(achievement.earned_at), 'MMM d')}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}