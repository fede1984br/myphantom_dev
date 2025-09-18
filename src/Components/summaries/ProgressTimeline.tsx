import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function ProgressTimeline({ summaries, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-3 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-indigo-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-lg text-neutral-800">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Progress Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {summaries.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">Progress history will appear here over time.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-200 to-blue-200" />
              
              {summaries.map((summary, index) => (
                <div key={summary.id} className="relative flex items-start gap-4 pb-6">
                  {/* Timeline dot */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                    index === 0 
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-500' 
                      : 'bg-white border-2 border-indigo-200'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-white' : 'bg-indigo-300'
                    }`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-lg border border-neutral-200 p-3 hover:border-indigo-200 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-neutral-800">
                          Week of {format(new Date(summary.week_start_date), "MMM d")}
                        </p>
                        <span className={`text-sm font-semibold ${
                          summary.overall_progress >= 80 ? 'text-green-600' :
                          summary.overall_progress >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {summary.overall_progress}%
                        </span>
                      </div>
                      <div className={`h-2 rounded-full ${
                        summary.overall_progress >= 80 ? 'bg-green-100' :
                        summary.overall_progress >= 60 ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`}>
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            summary.overall_progress >= 80 ? 'bg-green-500' :
                            summary.overall_progress >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${summary.overall_progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}