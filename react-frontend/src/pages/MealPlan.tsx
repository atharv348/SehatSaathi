import { Apple, Utensils, Coffee, Salad } from 'lucide-react';

function MealPlan() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Personalized Meal Plans
        </h1>
        <p className="text-green-700 text-lg">AI-powered nutrition guidance for your health goals</p>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-green-200 mb-6">
        <h2 className="text-2xl font-bold text-green-900 mb-6">Create Your Meal Plan</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dietary Goal</label>
            <select className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none">
              <option>Weight Loss</option>
              <option>Weight Gain</option>
              <option>Maintenance</option>
              <option>Muscle Building</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dietary Preference</label>
            <select className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none">
              <option>No Restrictions</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Keto</option>
              <option>Low Carb</option>
              <option>Gluten Free</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Calories</label>
              <input 
                type="number" 
                placeholder="2000"
                className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meals per Day</label>
              <select className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none">
                <option>3 meals</option>
                <option>4 meals</option>
                <option>5 meals</option>
                <option>6 meals</option>
              </select>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2">
            <Apple size={20} />
            Generate Meal Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-amber-200 text-center">
          <Coffee className="w-12 h-12 mx-auto text-amber-600 mb-3" />
          <h3 className="font-bold text-amber-900 mb-2">Breakfast</h3>
          <p className="text-2xl font-bold text-amber-700">450</p>
          <p className="text-sm text-gray-600">calories</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-orange-200 text-center">
          <Utensils className="w-12 h-12 mx-auto text-orange-600 mb-3" />
          <h3 className="font-bold text-orange-900 mb-2">Lunch</h3>
          <p className="text-2xl font-bold text-orange-700">650</p>
          <p className="text-sm text-gray-600">calories</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-200 text-center">
          <Salad className="w-12 h-12 mx-auto text-green-600 mb-3" />
          <h3 className="font-bold text-green-900 mb-2">Snacks</h3>
          <p className="text-2xl font-bold text-green-700">200</p>
          <p className="text-sm text-gray-600">calories</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200 text-center">
          <Utensils className="w-12 h-12 mx-auto text-blue-600 mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">Dinner</h3>
          <p className="text-2xl font-bold text-blue-700">700</p>
          <p className="text-sm text-gray-600">calories</p>
        </div>
      </div>
    </div>
  );
}

export default MealPlan;
