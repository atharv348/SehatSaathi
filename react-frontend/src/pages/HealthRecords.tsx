import { FileText, Calendar, Pill, ClipboardList } from 'lucide-react';

function HealthRecords() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Health Records
        </h1>
        <p className="text-teal-700 text-lg">Your complete medical history in one place</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <FileText className="text-blue-600" size={28} />
            </div>
            <h2 className="text-xl font-bold text-blue-900">Medical Reports</h2>
          </div>
          <p className="text-gray-600">Upload and manage your medical documents</p>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all">
            Upload Document
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <Pill className="text-green-600" size={28} />
            </div>
            <h2 className="text-xl font-bold text-green-900">Medications</h2>
          </div>
          <p className="text-gray-600">Track your prescriptions and dosages</p>
          <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all">
            Add Medication
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <Calendar className="text-purple-600" size={28} />
            </div>
            <h2 className="text-xl font-bold text-purple-900">Appointments</h2>
          </div>
          <p className="text-gray-600">Schedule and manage doctor visits</p>
          <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all">
            Schedule Appointment
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-cyan-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-cyan-100 rounded-xl mr-4">
              <ClipboardList className="text-cyan-600" size={28} />
            </div>
            <h2 className="text-xl font-bold text-cyan-900">Lab Results</h2>
          </div>
          <p className="text-gray-600">View your laboratory test results</p>
          <button className="mt-4 w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-all">
            View Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default HealthRecords;
