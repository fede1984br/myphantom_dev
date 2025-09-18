export interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  activeQuests: Quest[];
  completedQuests: Quest[];
}

export interface WeeklySummary {
  id: string;
  studentId: string;
  weekOf: Date;
  questsCompleted: number;
  pointsEarned: number;
}