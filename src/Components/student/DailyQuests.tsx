import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { Calendar, Star, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function DailyQuests({ quests, playerProgress, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-green-200">
      <CardHeader className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5" />
          📅 Today's Quests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {quests.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-sm text-gray-500">Daily quests coming soon!</p>
            </div>
          ) : (
            quests.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-green-100 rounded-lg p-3 hover:border-green-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                      {quest.icon} {quest.title}
                    </h4>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {quest.subject}
                      </Badge>
                      {quest.rewards?.xp_points && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          +{quest.rewards.xp_points} XP
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Quick Start
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}