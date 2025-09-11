import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { TrendingUp, Clock, Trophy, BookOpen } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, bgColor, textColor, change }) => (
  <Card className={`${bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${textColor} opacity-80`}>{title}</p>
          <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`w-4 h-4 ${textColor} opacity-70 mr-1`} />
              <span className={`text-sm ${textColor} opacity-70`}>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${textColor === 'text-white' ? 'bg-white bg-opacity-20' : 'bg-gray-100'}`}>
          <Icon className={`w-6 h-6 ${textColor === 'text-white' ? 'text-white' : textColor}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function QuickStats({ student, summary, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalActivities = summary?.subjects?.reduce((total, subject) => 
    total + (subject.activities_completed || 0), 0) || 0;

  const totalTime = summary?.subjects?.reduce((total, subject) => 
    total + (subject.time_spent_minutes || 0), 0) || 0;

  const achievements = summary?.subjects?.reduce((total, subject) => 
    total + (subject.key_achievements?.length || 0), 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="This Week's Progress"
        value={`${summary?.overall_progress || 0}%`}
        icon={TrendingUp}
        bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
        textColor="text-white"
        change="+8% from last week"
      />
      
      <StatCard
        title="Activities Completed"
        value={totalActivities}
        icon={BookOpen}
        bgColor="bg-gradient-to-br from-green-500 to-emerald-600"
        textColor="text-white"
        change="+3 this week"
      />
      
      <StatCard
        title="Learning Time"
        value={`${Math.round(totalTime / 60)}h ${totalTime % 60}m`}
        icon={Clock}
        bgColor="bg-white"
        textColor="text-neutral-800"
        change="Daily average: 45m"
      />
      
      <StatCard
        title="Achievements"
        value={achievements}
        icon={Trophy}
        bgColor="bg-gradient-to-br from-orange-500 to-amber-600"
        textColor="text-white"
        change="2 new this week"
      />
    </div>
  );
}