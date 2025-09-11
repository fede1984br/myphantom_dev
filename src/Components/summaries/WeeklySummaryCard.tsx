import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Skeleton } from "@/Components/ui/skeleton";
import { CalendarIcon, TrendingUp, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function WeeklySummaryCard({ summary, student, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-neutral-50 to-gray-100">
        <CardContent className="p-8 text-center">
          <CalendarIcon className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-600 mb-2">No Summary Available</h3>
          <p className="text-neutral-500">This week's summary will be generated once learning activities are completed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Weekly Summary</h2>
            <div className="flex items-center gap-2 text-sm text-neutral-600 mt-1">
              <CalendarIcon className="w-4 h-4" />
              {format(new Date(summary.week_start_date), "MMM d")} - {format(new Date(summary.week_end_date), "MMM d, yyyy")}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">{summary.overall_progress}%</div>
            <div className="text-sm text-neutral-600">Overall Progress</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-neutral-700">Week Progress</span>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <Progress value={summary.overall_progress} className="h-3 bg-neutral-100" />
          </div>

          {/* Highlights and Challenges */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800 flex items-center gap-2">
                🌟 Week Highlights
              </h4>
              <div className="space-y-2">
                {summary.highlights?.map((highlight, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <p className="text-sm text-green-800">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {summary.challenges && summary.challenges.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Areas for Support
                </h4>
                <div className="space-y-2">
                  {summary.challenges.map((challenge, index) => (
                    <div key={index} className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                      <p className="text-sm text-orange-800">{challenge}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}