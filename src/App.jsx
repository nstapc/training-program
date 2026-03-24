import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import NavigationBar from './components/NavigationBar';
import Breadcrumb from './components/Breadcrumb';
import LandingPage from './components/LandingPage';
import WorkoutsPage from './components/WorkoutsPage';
import WorkoutsCategoryPage from './components/WorkoutsCategoryPage';
import TrackingPage from './components/TrackingPage';
import ProgressDashboard from './components/ProgressDashboard';
import EnhancedProgressDashboard from './components/EnhancedProgressDashboard';
import NutritionGrid from './components/NutritionGrid';
import PushPullLegsPage from './components/PushPullLegsPage';
import FullBodyPage from './components/FullBodyPage';
import UpperLowerPage from './components/UpperLowerPage';
import { workouts } from './data/workouts';

const LandingPageWrapper = () => {
  const navigate = useNavigate();
  return <LandingPage onNavigate={navigate} />;
};

const WorkoutsCategoryPageWrapper = () => {
  const navigate = useNavigate();
  return <WorkoutsCategoryPage onBack={() => navigate('/')} />;
};

const WorkoutsPageWrapper = () => {
  const navigate = useNavigate();
  const { workoutKey } = useParams();
  
  // If we have a workoutKey parameter, show that specific workout
  // If no workoutKey parameter, show the selection page (initialWorkout = null)
  const initialWorkout = workoutKey && Object.keys(workouts).includes(workoutKey) ? workoutKey : null;
  
  return <WorkoutsPage onBack={() => navigate('/')} initialWorkout={initialWorkout} />;
};

const PushPullLegsPageWrapper = () => {
  const navigate = useNavigate();
  return <PushPullLegsPage onBack={() => navigate('/workouts')} />;
};

const FullBodyPageWrapper = () => {
  const navigate = useNavigate();
  return <FullBodyPage onBack={() => navigate('/workouts')} />;
};

const UpperLowerPageWrapper = () => {
  const navigate = useNavigate();
  return <UpperLowerPage onBack={() => navigate('/workouts')} />;
};

const TrackingPageWrapper = () => {
  const navigate = useNavigate();
  return <TrackingPage onBack={() => navigate('/')} />;
};

const ProgressDashboardWrapper = () => {
  const navigate = useNavigate();
  return <EnhancedProgressDashboard onBackToWorkout={() => navigate('/')} />;
};

const NutritionGridWrapper = () => {
  const navigate = useNavigate();
  return <NutritionGrid onBack={() => navigate('/')} />;
};

const AppContent = () => {
  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
      <NavigationBar />
      <Breadcrumb />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<WorkoutsPageWrapper />} />
          <Route path="/workouts" element={<WorkoutsCategoryPageWrapper />} />
          <Route path="/workouts/push-pull-legs" element={<PushPullLegsPageWrapper />} />
          <Route path="/workouts/full-body" element={<FullBodyPageWrapper />} />
          <Route path="/workouts/upper-lower" element={<UpperLowerPageWrapper />} />
          <Route path="/workouts/:workoutKey" element={<WorkoutsPageWrapper />} />
          <Route path="/tracking" element={<TrackingPageWrapper />} />
          <Route path="/dashboard" element={<ProgressDashboardWrapper />} />
          <Route path="/nutrition" element={<NutritionGridWrapper />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
};

export default App;
