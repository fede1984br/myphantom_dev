import React, { useState, useEffect } from "react";
import { Student } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, GraduationCap, Heart, Target, Edit3 } from "lucide-react";

import ProfileHeader from "../components/profile/ProfileHeader";
import LearningProfile from "../components/profile/LearningProfile";
import ProgressOverview from "../components/profile/ProgressOverview";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const studentsData = await Student.list();
    if (studentsData.length > 0) {
      setStudent(studentsData[0]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                Student Profile
              </h1>
              <p className="text-neutral-600">
                {student ? `Complete profile and learning insights for ${student.full_name}` : "Student information and learning profile"}
              </p>
            </div>
            <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-lg">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileHeader 
              student={student}
              isLoading={isLoading}
            />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <LearningProfile 
              student={student}
              isLoading={isLoading}
            />
            <ProgressOverview 
              student={student}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}