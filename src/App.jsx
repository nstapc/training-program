import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import WorkoutsPage from './components/WorkoutsPage';
import TrackingPage from './components/TrackingPage';
import ProgressDashboard from './components/ProgressDashboard';
import NutritionGrid from './components/NutritionGrid';
import InstallPrompt from './components/InstallPrompt';
import { workouts } from './data/workouts';

const LandingPageWrapper = () => {
  const navigate = useNavigate();
  return <LandingPage onNavigate={navigate} />;
};

const WorkoutsPageWrapper = () => {
  const navigate = useNavigate();
  const { workoutKey } = useParams();
  
  // If we have a workoutKey parameter, show that specific workout
  // If no workoutKey parameter, show the selection page (initialWorkout = null)
  const initialWorkout = workoutKey && Object.keys(workouts).includes(workoutKey) ? workoutKey : null;
  
  return <WorkoutsPage onBack={() => navigate('/')} initialWorkout={initialWorkout} />;
};

const TrackingPageWrapper = () => {
  const navigate = useNavigate();
  return <TrackingPage onBack={() => navigate('/')} />;
};

const ProgressDashboardWrapper = () => {
  const navigate = useNavigate();
  return <ProgressDashboard onBackToWorkout={() => navigate('/')} />;
};

const NutritionGridWrapper = () => {
  const navigate = useNavigate();
  return <NutritionGrid onBack={() => navigate('/')} />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/workouts" element={<WorkoutsPageWrapper />} />
        <Route path="/workouts/:workoutKey" element={<WorkoutsPageWrapper />} />
        <Route path="/tracking" element={<TrackingPageWrapper />} />
        <Route path="/dashboard" element={<ProgressDashboardWrapper />} />
        <Route path="/nutrition" element={<NutritionGridWrapper />} />
      </Routes>
      <InstallPrompt />
    </Router>
  );
};

export default App;
