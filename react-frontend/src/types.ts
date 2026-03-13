// Shared TypeScript types for ArogyaMitra
export interface UserData {
  username: string;
  full_name?: string;
  email?: string;
  age?: number;
  weight?: number;
  height?: number;
  fitness_goal?: string;
}

export interface Stats {
  diagnosesCount: number;
  workoutPlans: number;
  mealPlans: number;
  healthScore: number;
  totalPoints: number;
  currentStreak: number;
}

export interface DiagnosisResult {
  id: string;
  disease: string;
  confidence: number;
  category: string;
  date: string;
  recommendations: string[];
}

export interface VitalSign {
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: number[];
}

export interface RecentActivity {
  type: 'diagnosis' | 'workout' | 'meal' | 'vital';
  title: string;
  date: string;
  icon: any;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}
