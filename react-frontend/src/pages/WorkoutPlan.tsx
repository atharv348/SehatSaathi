import { Dumbbell, Target, Clock, TrendingUp } from 'lucide-react';

function WorkoutPlan() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Personalized Workout Plans
        </h1>
        <p className="text-purple-700 text-lg">AI-generated fitness routines tailored to your goals</p>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-purple-200 mb-6">
        <h2 className="text-2xl font-bold text-purple-900 mb-6">Create Your Workout Plan</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fitness Goal</label>
            <select className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none">
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>Endurance</option>
              <option>General Fitness</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level</label>
            <select className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Days per Week</label>
            <select className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none">
              <option>3 days</option>
              <option>4 days</option>
              <option>5 days</option>
              <option>6 days</option>
            </select>
          </div>

          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md flex items-center justify-center gap-2">
            <Dumbbell size={20} />
            Generate Workout Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200 text-center">
          <Target className="w-12 h-12 mx-auto text-blue-600 mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">Goal Oriented</h3>
          <p className="text-sm text-gray-600">Customized to your fitness objectives</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-200 text-center">
          <Clock className="w-12 h-12 mx-auto text-green-600 mb-3" />
          <h3 className="font-bold text-green-900 mb-2">Flexible Schedule</h3>
          <p className="text-sm text-gray-600">Adapt to your availability</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200 text-center">
          <TrendingUp className="w-12 h-12 mx-auto text-purple-600 mb-3" />
          <h3 className="font-bold text-purple-900 mb-2">Track Progress</h3>
          <p className="text-sm text-gray-600">Monitor your improvements</p>
        </div>
      </div>
    </div>
  );
}

export default WorkoutPlan;
