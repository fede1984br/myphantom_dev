export interface Student {
  id: string;
  name: string;
  email: string;
  full_name?: string;
  grade_level?: number;
  activeQuests: string[];
  completedQuests: string[];
}