import { useState, useEffect } from 'react';
import { Student, Summary } from '@/lib/types';
import { api } from '@/lib/api';
import { startOfWeek, format } from 'date-fns';

// Import your components
import QuickStats from '../components/dashboard/QuickStats';
import CurrentWeekProgress from '../components/dashboard/CurrentWeekProgress';
import RecentAchievements from '../components/dashboard/RecentAchievements';
import ActionableInsights from '../components/dashboard/ActionableInsights';

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      const studentsData = await api.students.getAll();
      setStudents(studentsData);

      if (studentsData.length > 0) {
        const firstStudent = studentsData[0];
        setCurrentStudent(firstStudent);
        
        const summariesData = await api.summaries.getForStudent(firstStudent.id);
        
        const currentWeekStart = startOfWeek(new Date());
        const summaryForCurrentWeek = summariesData.find(summary => 
          format(new Date(summary.week_start_date), 'yyyy-MM-dd') === format(currentWeekStart, 'yyyy-MM-dd')
        );
        
        setCurrentSummary(summaryForCurrentWeek || null);
      }
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      {currentStudent && (
        <h1 className="text-3xl font-bold text-neutral-800 mb-8">
          Welcome back! Here's how {currentStudent.full_name} is progressing this week. 👋
        </h1>
      )}

      {/* Main Grid and Components */}
      {isLoading ? (
        <p>Loading...</p>
      ) : currentStudent && currentSummary ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <QuickStats
              student={currentStudent}
              summary={currentSummary}
              isLoading={isLoading}
            />
          </div>
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
            <ActionableInsights />
            
            {/* Next Week Focus Section */}
            {currentSummary?.next_week_focus && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Next Week's Focus</h3>
                <div className="space-y-2">
                  {currentSummary.next_week_focus.map((focus, index) => (
                    <p key={index} className="text-green-800 text-sm">{focus}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>No summary data available for the current week.</p>
      )}
    </div>
  );
}