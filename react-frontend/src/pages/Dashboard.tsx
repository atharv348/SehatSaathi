import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Apple, Calendar, ChevronRight, AlertCircle,
  TrendingUp, Trophy, Target, Heart, MessageCircle,
  Stethoscope, Flame, Droplet, Wind, Zap, Star
} from 'lucide-react';
import api from '../services/api';
import { UserData, Stats, RecentActivity } from '../types';

function Dashboard() {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats>({
    diagnosesCount: 0,
    workoutPlans: 0,
    mealPlans: 0,
    healthScore: 85,
    totalPoints: 0,
    currentStreak: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check backend health
    api.get('/health')
      .then(() => {
        setBackendStatus('online');
        fetchAllData();
      })
      .catch(() => {
        setBackendStatus('offline');
        // Load demo data
        setUser({ username: 'User', full_name: 'Health Enthusiast', fitness_goal: 'Stay Healthy' });
        setStats({
          diagnosesCount: 5,
          workoutPlans: 3,
          mealPlans: 7,
          healthScore: 85,
          totalPoints: 450,
          currentStreak: 12
        });
        setRecentActivities([
          { type: 'diagnosis', title: 'Skin condition analyzed', date: 'Today', icon: Stethoscope },
          { type: 'workout', title: 'Generated workout plan', date: 'Yesterday', icon: Activity },
          { type: 'meal', title: 'Created meal plan', date: '2 days ago', icon: Apple },
          { type: 'vital', title: 'Logged vital signs', date: '3 days ago', icon: Heart }
        ]);
        setLoading(false);
      });
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch user data
      const userResponse = await api.get('/users/me', { headers });
      setUser(userResponse.data);

      // Fetch stats (adjust these endpoints to match your backend)
      const statsData = {
        diagnosesCount: 5,
        workoutPlans: 3,
        mealPlans: 7,
        healthScore: 85,
        totalPoints: 450,
        currentStreak: 12
      };
      setStats(statsData);

      // Build recent activities
      const activities: RecentActivity[] = [
        { type: 'diagnosis', title: 'Skin condition analyzed', date: new Date().toLocaleDateString(), icon: Stethoscope },
        { type: 'workout', title: 'Generated workout plan', date: new Date(Date.now() - 86400000).toLocaleDateString(), icon: Activity },
        { type: 'meal', title: 'Created meal plan', date: new Date(Date.now() - 172800000).toLocaleDateString(), icon: Apple },
      ];

      setRecentActivities(activities);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      setLoading(false);
    }
  };

  const motivationalQuotes = [
    "Every step towards health is progress! 🌟",
    "Your health is an investment, not an expense. 💪",
    "Strong body, strong mind! 🧠",
    "Today's effort is tomorrow's strength! 🔥",
    "Small changes lead to big transformations! ✨"
  ];

  const todayQuote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-blue-900">Loading your health dashboard...</p>
          <p className="text-sm text-blue-600 mt-2">Gathering your health data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Welcome back, {user?.full_name || user?.username || 'User'}! 👋
            </h1>
            <p className="text-blue-700 mt-3 flex items-center text-lg flex-wrap gap-2">
              <Flame className="text-orange-500" size={22} />
              <span className="font-semibold text-orange-600">{stats.currentStreak} day streak</span>
              <span className="mx-2 hidden md:inline">•</span>
              <span>{user?.fitness_goal || 'Getting healthier every day!'}</span>
            </p>
          </div>
          <div className={`flex items-center px-5 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all ${
            backendStatus === 'online' 
              ? 'bg-green-100 text-green-700 border-2 border-green-500' 
              : backendStatus === 'offline' 
              ? 'bg-amber-100 text-amber-700 border-2 border-amber-500' 
              : 'bg-gray-100 text-gray-700 border-2 border-gray-400'
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
              backendStatus === 'online' 
                ? 'bg-green-600 animate-pulse' 
                : backendStatus === 'offline' 
                ? 'bg-amber-500' 
                : 'bg-gray-400'
            }`} />
            {backendStatus === 'online' ? 'System Online' : 'Demo Mode'}
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl mr-4">
              <Star className="text-blue-600" size={28} />
            </div>
            <p className="text-lg md:text-xl font-semibold text-blue-900 italic">"{todayQuote}"</p>
          </div>
        </div>
      </header>

      {backendStatus === 'offline' && (
        <div className="mb-8 p-5 bg-amber-50 border-2 border-amber-400 rounded-2xl flex flex-col text-amber-800 shadow-lg">
          <div className="flex items-center mb-2">
            <AlertCircle className="mr-3" size={22} />
            <span className="font-bold text-lg">Running in Demo Mode</span>
          </div>
          <p className="text-sm ml-8">
            Backend API is not connected. Showing demo data. Start the backend with: <code className="bg-amber-200 px-2 py-1 rounded font-mono text-xs">python api_server.py</code>
          </p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Diagnoses Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-200 hover:shadow-lg hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Stethoscope className="text-blue-600" size={26} />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">AI</span>
          </div>
          <div className="text-3xl font-bold text-blue-900">{stats.diagnosesCount}</div>
          <div className="text-sm font-medium text-blue-700 mt-1">AI Diagnoses</div>
        </div>

        {/* Workout Plans Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-200 hover:shadow-lg hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="text-purple-600" size={26} />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Plans</span>
          </div>
          <div className="text-3xl font-bold text-purple-900">{stats.workoutPlans}</div>
          <div className="text-sm font-medium text-purple-700 mt-1">Workouts</div>
        </div>

        {/* Meal Plans Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-green-200 hover:shadow-lg hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Apple className="text-green-600" size={26} />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Nutrition</span>
          </div>
          <div className="text-3xl font-bold text-green-900">{stats.mealPlans}</div>
          <div className="text-sm font-medium text-green-700 mt-1">Meal Plans</div>
        </div>

        {/* Health Score Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-cyan-200 hover:shadow-lg hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Heart className="text-cyan-600" size={26} />
            </div>
            <span className="text-xs font-semibold text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">{stats.totalPoints} pts</span>
          </div>
          <div className="text-3xl font-bold text-cyan-900">{stats.healthScore}</div>
          <div className="text-sm font-medium text-cyan-700 mt-1">Health Score</div>
        </div>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* AI Diagnosis Card */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl shadow-lg border-2 border-blue-300 hover:shadow-xl transition-all">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-500 rounded-xl mr-4">
              <Stethoscope className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">AI Diagnosis</h2>
              <p className="text-blue-600 text-sm">Instant health analysis</p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-blue-700">Total Scans</span>
              <span className="font-bold text-lg text-blue-900">{stats.diagnosesCount}</span>
            </div>
            <div className="text-xs text-blue-600">Skin, Eye, Oral, Bone & more</div>
          </div>
          <button
            onClick={() => navigate('/diagnosis')}
            className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold shadow-md"
          >
            Start Diagnosis <ChevronRight size={18} className="ml-1" />
          </button>
        </div>

        {/* Workout Plan Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-lg border-2 border-purple-300 hover:shadow-xl transition-all">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-500 rounded-xl mr-4">
              <Activity className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-900">Workout Plans</h2>
              <p className="text-purple-600 text-sm">Personalized routines</p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-purple-700">Active Plans</span>
              <span className="font-bold text-lg text-purple-900">{stats.workoutPlans}</span>
            </div>
            <div className="text-xs text-purple-600">Build strength & endurance</div>
          </div>
          <button
            onClick={() => navigate('/workout')}
            className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-md"
          >
            Create Workout <ChevronRight size={18} className="ml-1" />
          </button>
        </div>

        {/* Meal Plan Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg border-2 border-green-300 hover:shadow-xl transition-all">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-500 rounded-xl mr-4">
              <Apple className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-900">Meal Plans</h2>
              <p className="text-green-600 text-sm">Nutrition guidance</p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-green-700">Created Plans</span>
              <span className="font-bold text-lg text-green-900">{stats.mealPlans}</span>
            </div>
            <div className="text-xs text-green-600">Balanced & delicious meals</div>
          </div>
          <button
            onClick={() => navigate('/meals')}
            className="w-full flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-md"
          >
            Plan Meals <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
            <TrendingUp className="mr-2 text-blue-600" size={24} />
            Recent Activities
          </h2>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-all"
                  >
                    <div className="p-2 bg-blue-200 rounded-lg mr-3">
                      <Icon className="text-blue-700" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-blue-900 text-sm">{activity.title}</p>
                      <p className="text-xs text-blue-600">{activity.date}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-blue-600 text-center py-4">No recent activities yet. Start your health journey!</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-cyan-200">
          <h2 className="text-2xl font-bold text-cyan-900 mb-4 flex items-center">
            <Zap className="mr-2 text-cyan-600" size={24} />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/vitals')}
              className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-lg hover:shadow-md transition-all group"
            >
              <Heart className="text-red-600 mb-2 mx-auto group-hover:scale-110 transition-transform" size={32} />
              <p className="font-semibold text-red-900 text-sm">Vital Signs</p>
            </button>
            <button
              onClick={() => navigate('/coach')}
              className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg hover:shadow-md transition-all group"
            >
              <MessageCircle className="text-blue-600 mb-2 mx-auto group-hover:scale-110 transition-transform" size={32} />
              <p className="font-semibold text-blue-900 text-sm">AI Coach</p>
            </button>
            <button
              onClick={() => navigate('/progress')}
              className="p-4 bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-lg hover:shadow-md transition-all group"
            >
              <TrendingUp className="text-green-600 mb-2 mx-auto group-hover:scale-110 transition-transform" size={32} />
              <p className="font-semibold text-green-900 text-sm">Progress</p>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg hover:shadow-md transition-all group"
            >
              <Target className="text-purple-600 mb-2 mx-auto group-hover:scale-110 transition-transform" size={32} />
              <p className="font-semibold text-purple-900 text-sm">Profile</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
