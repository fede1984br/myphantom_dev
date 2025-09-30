// The Student type from '@my-phantom/core' is incomplete.
// Defining it locally to include all properties used in the app.
export interface Student {
  id: string;
  full_name: string;
  grade_level: number;
  avatar_url?: string;
  age?: number;
  sen_status?: boolean;
  sen_details?: string;
  xp_points?: number;
  current_streak?: number;
  achievements_unlocked?: string[];
  learning_profile?: any; // Using 'any' for now, can be refined later
}

export interface Achievement {
  name: string;
  description: string;
}

export interface Subject {
  name: 'Mathematics' | 'English' | 'Science' | 'History' | 'Art';
  key_achievements: Achievement[];
  activities_completed: number;
  time_spent_minutes: number;
  progress: number;
}

export interface Summary {
  id: string;
  student_id: string;
  week_start_date: string;
  week_end_date: string;
  overall_progress: number;
  subjects: Subject[];
  highlights?: string[];
  challenges?: string[];
  next_week_focus?: string[];
}

export interface FormattedAchievement {
  text: Achievement;
  subject: string;
}

export type HighlightItem = 
  { text: string; type: 'highlight'; subject?: never; } | 
  { text: FormattedAchievement; type: 'achievement'; subject: string; };

export interface Quest {
  id: string;
  title: string;
  description: string; // Added
  subject: 'mathematics' | 'english' | 'science' | 'history' | 'art';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'boss';
  is_boss: boolean; // Added
  icon: string;
  estimated_time_min: number; // Added
  content: {
    activities: any[];
  };
  rewards: {
    xp_points: number;
    coins: number;
    badges: string[];
  };
}

export interface PlayerProgress {
  id: string;
  quest_id: string;
  status: 'completed' | 'in_progress' | 'available' | 'locked';
  progress_percentage: number; // Added
  activities_completed: string[];
  time_spent: number;
}

export interface DailyStreak {
  current_streak: number;
  last_activity_date: string;
  level: number;
  total_xp: number;
}

export interface Message {
  id: string;
  type: 'user' | 'phantom';
  content: string;
  timestamp: Date;
}

export interface PhantomMessage {
  text: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export interface StudentAchievement {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  achievement_type: 'quest_master' | 'streak_keeper' | 'speed_learner' | 'perfectionist' | 'explorer' | 'boss_slayer';
  icon: string;
  earned_at: string | null;
}

export interface Activity {
  type: 'quiz' | 'reading' | 'video' | 'writing' | 'game';
  title: string;
  points: number;
  content: any;
}

export interface QuestFilterState {
  subject: string;
  difficulty: string;
  status: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number; // The index of the correct option
}

export interface QuizAnswer {
  questionIndex: number;
  selected: number | null;
  correct: boolean;
}

export interface Assignment {
  id: number; // Changed from string to number
  title: string;
  subject: string; // Added
  dueDate: string; // Added
  status: AssignmentStatus;
  points: number; // Added
  description: string; // Added
  type: string; // Added
}

export type AssignmentStatus = 'completed' | 'in_progress' | 'pending' | 'default';