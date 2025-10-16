export interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

export interface Student {
  uid: string;
  fullName: string;
  email: string;
  activeQuests: Quest[];
  completedQuests: Quest[];
  grade_level?: number;
  age?: number;
  iep_settings?: {
    focus_areas: string[];
    support_strategies: string[];
  };
  accessibility_preferences?: {
    font_size: 'small' | 'medium' | 'large';
    dyslexia_friendly_mode: boolean;
    text_to_speech: boolean;
  };
}

export interface WeeklySummary {
  id: string;
  studentId: string;
  weekOf: Date;
  questsCompleted: number;
  pointsEarned: number;
}

export interface StudentAchievement {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  earned_at: Date | null;
}

export interface StudentProgress {
  quest_id: string;
  status: 'locked' | 'in-progress' | 'completed';
  activities_completed: number;
  time_spent: number;
}

export interface DailyStreak {
  current_streak: number;
  longest_streak: number;
}

export interface SubjectProgress {
  subject: string;
  progress: number;
  last_activity_date: Date;
}