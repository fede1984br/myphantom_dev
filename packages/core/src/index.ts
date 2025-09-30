export interface Student {
  id: string;
  name: string;
  email: string;
  // These fields are from your frontend type, let's merge them
  full_name?: string; // full_name from frontend, name from backend
  grade_level?: number;
  activeQuests: string[];
  completedQuests: string[];
}