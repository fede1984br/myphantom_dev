import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { Lightbulb, ArrowRight, AlertCircle } from "lucide-react";

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200'
};

const categoryIcons = {
  practice: '📝',
  support: '🤝',
  motivation: '⭐',
  tools: '🛠️',
  routine: '📅'
};

export default function ActionableInsights({ summary, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const insights = summary?.actionable_insights || [];

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-violet-50 to-purple-50">
        <CardTitle className="flex items-center gap-2 text-lg text-neutral-800">
          <Lightbulb className="w-5 h-5 text-violet-600" />
          Actionable Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {insights.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-500">Personalized insights will appear here based on your child's progress.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="border border-neutral-200 rounded-xl p-4 hover:border-violet-300 transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{categoryIcons[insight.category] || '💡'}</span>
                    <h4 className="font-semibold text-neutral-800">{insight.title}</h4>
                  </div>
                  <Badge variant="outline" className={priorityColors[insight.priority] || priorityColors.medium}>
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {insight.description}
                </p>
                <div className="flex items-center mt-3 text-xs text-violet-600 font-medium">
                  <span>Take Action</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}