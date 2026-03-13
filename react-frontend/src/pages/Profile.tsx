import { User, Mail, Calendar, Weight, Ruler, Target, Edit2, Save } from 'lucide-react';
import { useState } from 'react';

function Profile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Health Enthusiast',
    email: 'user@arogyamitra.com',
    age: 28,
    weight: 70,
    height: 170,
    fitnessGoal: 'Stay Healthy'
  });

  const handleSave = () => {
    setEditing(false);
    // TODO: Save to backend
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Your Profile
        </h1>
        <p className="text-purple-700 text-lg">Manage your personal information and preferences</p>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-purple-200">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              editing
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {editing ? (
              <>
                <Save size={20} />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 size={20} />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Profile Details */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                disabled={!editing}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!editing}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Age
              </label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                disabled={!editing}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Weight size={16} />
                Weight (kg)
              </label>
              <input
                type="number"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) })}
                disabled={!editing}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Ruler size={16} />
                Height (cm)
              </label>
              <input
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) })}
                disabled={!editing}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Target size={16} />
                Fitness Goal
              </label>
              <select
                value={profile.fitnessGoal}
                onChange={(e) => setProfile({ ...profile, fitnessGoal: e.target.value })}
                disabled={!editing}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-50"
              >
                <option>Stay Healthy</option>
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>Improve Endurance</option>
                <option>General Fitness</option>
              </select>
            </div>
          </div>
        </div>

        {/* Health Stats */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Health Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
              <p className="text-sm text-blue-700 mb-1">BMI</p>
              <p className="text-2xl font-bold text-blue-900">
                {(profile.weight / ((profile.height / 100) ** 2)).toFixed(1)}
              </p>
            </div>
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
              <p className="text-sm text-green-700 mb-1">Days Active</p>
              <p className="text-2xl font-bold text-green-900">24</p>
            </div>
            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg text-center">
              <p className="text-sm text-purple-700 mb-1">Workouts</p>
              <p className="text-2xl font-bold text-purple-900">18</p>
            </div>
            <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg text-center">
              <p className="text-sm text-amber-700 mb-1">Points</p>
              <p className="text-2xl font-bold text-amber-900">450</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
