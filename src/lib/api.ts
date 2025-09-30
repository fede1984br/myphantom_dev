import { Student, StudentAchievement, Summary, Quest, PlayerProgress, DailyStreak } from './types';
import { startOfWeek, subWeeks, endOfWeek } from 'date-fns';

const mockAchievements: StudentAchievement[] = [
  { id: '1', title: 'First Quest', description: 'Completed your first quest.', rarity: 'common', achievement_type: 'quest_master', icon: '📜', earned_at: new Date().toISOString() },
  { id: '2', title: 'Streak Keeper', description: 'Maintained a 3-day streak.', rarity: 'rare', achievement_type: 'streak_keeper', icon: '🔥', earned_at: new Date().toISOString() }
];

const mockStudents: Student[] = [
  { 
    id: 'student_001', 
    full_name: 'Alex Johnson', 
    grade_level: 5, 
    avatar_url: 'https://i.pravatar.cc/150?u=alex',
    age: 10,
    sen_status: false,
    sen_details: 'No special educational needs.',
    xp_points: 1250,
    current_streak: 5,
    achievements_unlocked: ['1', '2']
  }
];

const mockSummaries: Summary[] = [
  { 
    id: 'summary_1', 
    student_id: 'student_001', 
    week_start_date: startOfWeek(new Date()).toISOString(), 
    week_end_date: endOfWeek(new Date()).toISOString(),
    overall_progress: 75,
    subjects: [
      { name: 'Mathematics', key_achievements: [], activities_completed: 5, time_spent_minutes: 60, progress: 80 },
      { name: 'Science', key_achievements: [], activities_completed: 3, time_spent_minutes: 45, progress: 70 }
    ],
    next_week_focus: ['Long Division', 'The Water Cycle'] 
  },
  { 
    id: 'summary_2', 
    student_id: 'student_001', 
    week_start_date: startOfWeek(subWeeks(new Date(), 1)).toISOString(), 
    week_end_date: endOfWeek(subWeeks(new Date(), 1)).toISOString(),
    overall_progress: 68,
    subjects: [],
    next_week_focus: ['Fractions', 'Photosynthesis'] 
  }
];

const mockQuests: Quest[] = [
  {
    id: 'quest_001',
    title: 'Introduction to Fractions',
    description: 'Learn the basics of fractions, including numerators, denominators, and simple comparisons.',
    subject: 'mathematics',
    difficulty: 'beginner',
    is_boss: false,
    icon: '➗',
    estimated_time_min: 15,
    content: {
      activities: [
        { type: 'reading', title: 'What is a Fraction?', points: 10, content: '...' },
        { type: 'quiz', title: 'Fraction Basics Quiz', points: 20, content: { questions: [] } },
      ],
    },
    rewards: { xp_points: 50, coins: 10, badges: ['Fraction Beginner'] },
  },
];

let mockPlayerProgress: PlayerProgress[] = [
  {
    id: 'progress_001',
    quest_id: 'quest_001',
    status: 'in_progress',
    progress_percentage: 0,
    activities_completed: [],
    time_spent: 0,
  },
];

const mockDailyStreaks: DailyStreak[] = [
  {
    current_streak: 5,
    last_activity_date: new Date().toISOString(),
    level: 2,
    total_xp: 1250,
  }
];

export const api = {
  achievements: {
    getAll: async (params: { student_id: string }): Promise<StudentAchievement[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Fetching achievements for student:', params.student_id);
      return mockAchievements; 
    }
  },
  students: {
    getAll: async (): Promise<Student[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockStudents;
    }
  },
  summaries: {
    getForStudent: async (studentId: string): Promise<Summary[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Fetching summaries for student: ${studentId}`);
      return mockSummaries;
    }
  },
  quests: {
    get: async (questId: string): Promise<Quest | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockQuests.find(q => q.id === questId);
    },
    list: async (): Promise<Quest[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockQuests;
    }
  },
  playerProgress: {
    filter: async (params: { student_id: string; quest_id: string }): Promise<PlayerProgress[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      // In a real API, we'd use student_id. Here we just filter by quest_id.
      return mockPlayerProgress.filter(p => p.quest_id === params.quest_id);
    },
    update: async (progressId: string, data: Partial<PlayerProgress>): Promise<PlayerProgress | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const progressIndex = mockPlayerProgress.findIndex(p => p.id === progressId);
      if (progressIndex > -1) {
        mockPlayerProgress[progressIndex] = { ...mockPlayerProgress[progressIndex], ...data };
        return mockPlayerProgress[progressIndex];
      }
      return undefined;
    },
    getForStudent: async (studentId: string): Promise<PlayerProgress[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockPlayerProgress;
    }
  },
  dailyStreak: {
    getForStudent: async (studentId: string): Promise<DailyStreak[]> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`Fetching daily streak for student: ${studentId}`);
      return mockDailyStreaks;
    }
  }
};