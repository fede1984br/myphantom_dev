import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, Target } from "lucide-react";

const subjectColors = {
  'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
  'English': 'bg-green-100 text-green-800 border-green-200', 
  'Science': 'bg-purple-100 text-purple-800 border-purple-200',
  'History': 'bg-orange-100 text-orange-800 border-orange-200',
  'Art': 'bg-pink-100 text-pink-800 border-pink-200'
};

export default function SubjectBreakdown({ summary, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-3 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const subjects = summary?.subjects || [];

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-emerald-50 to-green-50">
        <CardTitle className="flex items-center gap-2 text-xl text-neutral-800">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          Subject Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {subjects.map((subject, index) => (
            <div key={index} className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800">{subject.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {subject.activities_completed || 0} activities
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.floor((subject.time_spent_minutes || 0) / 60)}h {(subject.time_spent_minutes || 0) % 60}m
                    </span>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={subjectColors[subject.name] || 'bg-gray-100 text-gray-800 border-gray-200'}
                >
                  {subject.progress || 0}% Complete
                </Badge>
              </div>

              <Progress 
                value={subject.progress || 0} 
                className="h-4 bg-neutral-100" 
              />

              {subject.key_achievements && subject.key_achievements.length > 0 && (
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                  <h4 className="font-medium text-emerald-800 mb-2">This Week's Achievements:</h4>
                  <ul className="space-y-1">
                    {subject.key_achievements.map((achievement, idx) => (
                      <li key={idx} className="text-sm text-emerald-700 flex items-start gap-2">
                        <span className="text-emerald-600 mt-1 flex-shrink-0">✓</span>
                        <span>{achievement}</span>
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