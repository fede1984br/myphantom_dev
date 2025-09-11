
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { Brain, TrendingUp, AlertCircle, Heart } from "lucide-react";

export default function LearningProfile({ student, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-18" />
                <Skeleton className="h-6 w-22" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const learningProfile = student?.learning_profile || {};
  const strengths = learningProfile.strengths || [];
  const areasForGrowth = learningProfile.areas_for_growth || [];

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-xl text-neutral-800">
          <Brain className="w-6 h-6 text-purple-600" />
          Learning Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Learning Style */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">Learning Style</h3>
            <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200 px-3 py-1">
              {learningProfile.learning_style?.charAt(0).toUpperCase() + learningProfile.learning_style?.slice(1) || 'Mixed'}
            </Badge>
          </div>

          {/* Strengths */}
          <div>
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Strengths
            </h3>
            {strengths.length === 0 ? (
              <p className="text-neutral-500 text-sm">No strengths recorded yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {strengths.map((strength, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 border-green-200">
                    {strength}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Areas for Growth */}
          <div>
            <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Areas for Growth
            </h3>
            {areasForGrowth.length === 0 ? (
              <p className="text-neutral-500 text-sm">No growth areas identified yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {areasForGrowth.map((area, index) => (
                  <Badge key={index} className="bg-orange-100 text-orange-800 border-orange-200">
                    {area}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* SEN Details */}
          {student?.sen_status && student.sen_details && (
            <div>
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Special Educational Needs
              </h3>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-purple-800 text-sm">{student.sen_details}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
