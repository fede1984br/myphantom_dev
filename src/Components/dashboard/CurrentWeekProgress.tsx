import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Skeleton } from "@/Components/ui/skeleton";
import { BookOpen, Clock } from "lucide-react";

export default function CurrentWeekProgress({ summary, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-neutral-50 to-gray-100">
        <CardContent className="p-8 text-center">
          <BookOpen className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-600 mb-2">No Data Yet</h3>
          <p className="text-neutral-500">Weekly progress data will appear here once your child begins their learning activities.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-blue-50 to-green-50">
        <CardTitle className="flex items-center gap-2 text-xl text-neutral-800">
          <BookOpen className="w-6 h-6 text-primary-600" />
          Subject Progress This Week
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {summary.subjects?.map((subject, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg text-neutral-800">{subject.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-neutral-600 mt-1">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {subject.activities_completed || 0} activities
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.round((subject.time_spent_minutes || 0) / 60)}h {(subject.time_spent_minutes || 0) % 60}m
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary-600">{subject.progress || 0}%</span>
                </div>
              </div>
              
              <Progress 
                value={subject.progress || 0} 
                className="h-3 bg-neutral-100" 
              />
              
              {subject.key_achievements && subject.key_achievements.length > 0 && (
                <div className="bg-green-50 rounded-lg p-3 mt-3">
                  <p className="text-sm font-medium text-green-800 mb-1">Key Achievements:</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    {subject.key_achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-green-600 mt-1">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}