import React, { useState, useEffect } from "react";
import { Student, WeeklySummary } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from "date-fns";

import WeeklySummaryCard from "../components/summaries/WeeklySummaryCard";
import SubjectBreakdown from "../components/summaries/SubjectBreakdown";
import ProgressTimeline from "../components/summaries/ProgressTimeline";

export default function WeeklySummaries() {
  const [students, setStudents] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentWeek]);

  const loadData = async () => {
    setIsLoading(true);
    const studentsData = await Student.list();
    setStudents(studentsData);

    if (studentsData.length > 0) {
      const summariesData = await WeeklySummary.filter({
        student_id: studentsData[0].id
      }, '-week_start_date', 12);
      setSummaries(summariesData);
    }
    setIsLoading(false);
  };

  const currentStudent = students.length > 0 ? students[0] : null;
  const currentWeekStart = startOfWeek(currentWeek);
  const currentWeekEnd = endOfWeek(currentWeek);
  
  const currentWeekSummary = summaries.find(s => 
    format(new Date(s.week_start_date), 'yyyy-MM-dd') === format(currentWeekStart, 'yyyy-MM-dd')
  );

  const navigateWeek = (direction) => {
    setCurrentWeek(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                Weekly Progress Reports
              </h1>
              <p className="text-neutral-600">
                {currentStudent ? `Detailed insights into ${currentStudent.full_name}'s learning journey` : "Track weekly progress and insights"}
              </p>
            </div>
            
            {/* Week Navigation */}
            <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 p-2 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateWeek('prev')}
                className="hover:bg-neutral-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 px-3 py-1">
                <CalendarIcon className="w-4 h-4 text-neutral-500" />
                <span className="font-medium text-neutral-800">
                  {format(currentWeekStart, "MMM d")} - {format(currentWeekEnd, "MMM d, yyyy")}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateWeek('next')}
                className="hover:bg-neutral-100"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WeeklySummaryCard 
              summary={currentWeekSummary}
              student={currentStudent}
              isLoading={isLoading}
            />
            <SubjectBreakdown 
              summary={currentWeekSummary}
              isLoading={isLoading}
            />
          </div>

          <div className="space-y-6">
            <ProgressTimeline 
              summaries={summaries.slice(0, 6)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}