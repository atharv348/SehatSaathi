import { TrendingUp, Calendar, Award, BarChart3 } from 'lucide-react';

function Progress() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Progress Tracking
        </h1>
        <p className="text-teal-700 text-lg">Monitor your health journey and achievements</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200 text-center">
          <TrendingUp className="w-12 h-12 mx-auto text-blue-600 mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">Weight Progress</h3>
          <p className="text-3xl font-bold text-blue-700">-5.2</p>
          <p className="text-sm text-gray-600 mt-1">kg this month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-200 text-center">
          <Calendar className="w-12 h-12 mx-auto text-green-600 mb-3" />
          <h3 className="font-bold text-green-900 mb-2">Active Days</h3>
          <p className="text-3xl font-bold text-green-700">24</p>
          <p className="text-sm text-gray-600 mt-1">out of 30 days</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200 text-center">
          <Award className="w-12 h-12 mx-auto text-purple-600 mb-3" />
          <h3 className="font-bold text-purple-900 mb-2">Total Points</h3>
          <p className="text-3xl font-bold text-purple-700">450</p>
          <p className="text-sm text-gray-600 mt-1">earned points</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-cyan-200 text-center">
          <BarChart3 className="w-12 h-12 mx-auto text-cyan-600 mb-3" />
          <h3 className="font-bold text-cyan-900 mb-2">Workouts</h3>
          <p className="text-3xl font-bold text-cyan-700">18</p>
          <p className="text-sm text-gray-600 mt-1">completed workouts</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Weight Trend</h2>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 flex items-center justify-center">
            <p className="text-blue-600 font-semibold">Interactive chart coming soon</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-200">
          <h2 className="text-xl font-bold text-green-900 mb-4">Activity Level</h2>
          <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 flex items-center justify-center">
            <p className="text-green-600 font-semibold">Interactive chart coming soon</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <Award className="text-amber-600" size={28} />
          Recent Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg text-center">
            <div className="text-4xl mb-2">🏆</div>
            <p className="font-bold text-amber-900">First Week Complete</p>
            <p className="text-sm text-amber-700">+50 points</p>
          </div>
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
            <div className="text-4xl mb-2">💪</div>
            <p className="font-bold text-blue-900">10 Workouts Done</p>
            <p className="text-sm text-blue-700">+100 points</p>
          </div>
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
            <div className="text-4xl mb-2">🔥</div>
            <p className="font-bold text-green-900">7 Day Streak</p>
            <p className="text-sm text-green-700">+75 points</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Progress;
