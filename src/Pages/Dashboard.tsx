import React, { useState, useEffect } from "react";
import { Student, WeeklySummary } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, Trophy, Target, BookOpen, Star } from "lucide-react";
import { format, startOfWeek, endOfWeek } from "date-fns";

import QuickStats from "../components/dashboard/QuickStats";
import CurrentWeekProgress from "../components/dashboard/CurrentWeekProgress";
import RecentAchievements from "../components/dashboard/RecentAchievements";
import ActionableInsights from "../components/dashboard/ActionableInsights";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const studentsData = await Student.list();
    setStudents(studentsData);

    if (studentsData.length > 0) {
      const currentWeekStart = startOfWeek(new Date());
      const summaries = await WeeklySummary.filter({
        student_id: studentsData[0].id,
        week_start_date: format(currentWeekStart, 'yyyy-MM-dd')
      }, '-created_date', 1);
      
      if (summaries.length > 0) {
        setCurrentSummary(summaries[0]);
      }
    }
    setIsLoading(false);
  };

  const currentStudent = students.length > 0 ? students[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-neutral-600">
                {currentStudent ? `Here's how ${currentStudent.full_name} is progressing this week` : "Track your child's learning journey"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Clock className="w-4 h-4" />
              {format(new Date(), "EEEE, MMM d, yyyy")}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats 
          student={currentStudent}
          summary={currentSummary}
          isLoading={isLoading}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <CurrentWeekProgress 
              summary={currentSummary}
              isLoading={isLoading}
            />
            <RecentAchievements 
              student={currentStudent}
              summary={currentSummary}
              isLoading={isLoading}
            />
          </div>

          <div className="space-y-6">
            <ActionableInsights 
              summary={currentSummary}
              isLoading={isLoading}
            />
            
            {/* Next Week Focus */}
            {currentSummary?.next_week_focus && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                    <Target className="w-5 h-5" />
                    Next Week's Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentSummary.next_week_focus.map((focus, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                        <p className="text-green-800 text-sm">{focus}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}