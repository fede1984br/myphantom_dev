import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { Trophy, Star, Target } from "lucide-react";

export default function RecentAchievements({ student, summary, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const highlights = summary?.highlights || [];
  const allAchievements = summary?.subjects?.reduce((acc, subject) => {
    if (subject.key_achievements) {
      return [...acc, ...subject.key_achievements.map(achievement => ({
        text: achievement,
        subject: subject.name
      }))];
    }
    return acc;
  }, []) || [];

  const combinedHighlights = [
    ...highlights.map(highlight => ({ text: highlight, type: 'highlight' })),
    ...allAchievements.map(achievement => ({ ...achievement, type: 'achievement' }))
  ];

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardTitle className="flex items-center gap-2 text-xl text-neutral-800">
          <Trophy className="w-6 h-6 text-amber-600" />
          Highlights & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {combinedHighlights.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">Achievements will appear here as your child progresses!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {combinedHighlights.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-neutral-50 to-gray-50 hover:from-amber-50 hover:to-orange-50 transition-all duration-300">
                <div className="flex-shrink-0">
                  {item.type === 'highlight' ? (
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-neutral-800 font-medium">{item.text}</p>
                  {item.subject && (
                    <Badge variant="secondary" className="mt-2 bg-neutral-100 text-neutral-600">
                      {item.subject}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}