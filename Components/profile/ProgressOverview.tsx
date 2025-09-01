import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Calendar, Clock } from "lucide-react";

export default function ProgressOverview({ student, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock data for demonstration - in a real app this would come from WeeklySummary aggregation
  const overallProgress = 78;
  const subjectProgress = [
    { name: 'Mathematics', progress: 85 },
    { name: 'English', progress: 72 },
    { name: 'Science', progress: 80 },
    { name: 'History', progress: 75 }
  ];

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardTitle className="flex items-center gap-2 text-xl text-neutral-800">
          <BarChart3 className="w-6 h-6 text-emerald-600" />
          Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-blue-800">Overall Progress</h3>
              <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3 bg-blue-100" />
            <p className="text-xs text-blue-600 mt-2">Based on all subject areas</p>
          </div>

          {/* Subject Progress */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-4">Subject Progress</h3>
            <div className="space-y-4">
              {subjectProgress.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-neutral-700">{subject.name}</span>
                    <span className="text-sm font-semibold text-neutral-600">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2 bg-neutral-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
              <Calendar className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-amber-800">This Month</p>
              <p className="text-lg font-bold text-amber-700">12 days</p>
              <p className="text-xs text-amber-600">active learning</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-800">Total Time</p>
              <p className="text-lg font-bold text-green-700">24h</p>
              <p className="text-xs text-green-600">this month</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}