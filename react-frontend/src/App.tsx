import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Diagnosis from './pages/Diagnosis';
import VitalSigns from './pages/VitalSigns';
import HealthRecords from './pages/HealthRecords';
import WorkoutPlan from './pages/WorkoutPlan';
import MealPlan from './pages/MealPlan';
import Progress from './pages/Progress';
import AICoach from './pages/AICoach';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="diagnosis" element={<Diagnosis />} />
          <Route path="vitals" element={<VitalSigns />} />
          <Route path="records" element={<HealthRecords />} />
          <Route path="workout" element={<WorkoutPlan />} />
          <Route path="meals" element={<MealPlan />} />
          <Route path="progress" element={<Progress />} />
          <Route path="coach" element={<AICoach />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
