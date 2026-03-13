import { Heart, Activity, Droplet, Wind, Thermometer, Clock } from 'lucide-react';

function VitalSigns() {
  const vitals = [
    { name: 'Heart Rate', value: 72, unit: 'bpm', icon: Heart, color: 'red', status: 'normal' },
    { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, color: 'purple', status: 'normal' },
    { name: 'Oxygen Saturation', value: 98, unit: '%', icon: Droplet, color: 'blue', status: 'normal' },
    { name: 'Respiration Rate', value: 16, unit: '/min', icon: Wind, color: 'cyan', status: 'normal' },
    { name: 'Temperature', value: 98.6, unit: '°F', icon: Thermometer, color: 'orange', status: 'normal' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Vital Signs Monitoring
        </h1>
        <p className="text-red-700 text-lg flex items-center gap-2">
          <Clock size={20} />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vitals.map((vital, index) => {
          const Icon = vital.icon;
          return (
            <div
              key={index}
              className={`bg-white p-6 rounded-xl shadow-lg border-2 border-${vital.color}-200 hover:shadow-xl transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${vital.color}-100 rounded-xl`}>
                  <Icon className={`text-${vital.color}-600`} size={32} />
                </div>
                <span className={`text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-full border border-green-400`}>
                  {vital.status.toUpperCase()}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-2">{vital.name}</h3>
              
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold text-${vital.color}-600`}>
                  {vital.value}
                </span>
                <span className="text-gray-500 font-medium">{vital.unit}</span>
              </div>

              {/* Placeholder trend line */}
              <div className="mt-4 h-16 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 flex items-center justify-center text-sm text-blue-600">
                Trend data visualization
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">📊 Historical Data</h2>
        <div className="text-center py-12 text-blue-600">
          <Activity className="w-20 h-20 mx-auto mb-4 opacity-30" />
          <p className="font-semibold">Coming soon: Interactive charts and historical trends</p>
        </div>
      </div>
    </div>
  );
}

export default VitalSigns;
