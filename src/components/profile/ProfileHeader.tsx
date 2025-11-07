import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, GraduationCap, Heart } from "lucide-react";
import { Student as BaseStudent } from '@/lib/types';

interface ProfileHeaderProps {
  student: BaseStudent & {
    age?: number;
    sen_status?: boolean;
    learning_profile?: {
      learning_style?: string;
    };
  };
  isLoading: boolean;
} 

export default function ProfileHeader({ student, isLoading }: ProfileHeaderProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-6 text-center">
          <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-20 mx-auto mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!student) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-neutral-50 to-gray-100">
        <CardContent className="p-8 text-center">
          <User className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-600 mb-2">No Student Profile</h3>
          <p className="text-neutral-500">Create a student profile to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardContent className="p-6">
        <div className="text-center">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold text-black">
              {student.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Basic Info */}
          <h2 className="text-2xl font-bold text-neutral-800 mb-1">{student.full_name}</h2>
          <p className="text-neutral-600 mb-4">Grade {student.grade_level} • Age {student.age}</p>
          
          {/* SEN Badge */}
          {student.sen_status && (
            <Badge className="bg-purple-100 text-purple-800 border-purple-200 mb-4">
              <Heart className="w-3 h-3 mr-1" />
              Special Educational Needs
            </Badge>
          )}
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <GraduationCap className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-blue-800">Grade Level</p>
              <p className="text-xs text-blue-600">{student.grade_level}</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <Heart className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-green-800">Learning Style</p>
              <p className="text-xs text-green-600 capitalize">
                {student.learning_profile?.learning_style || 'Mixed'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}