import React, { useEffect, useState } from 'react';
import { Dumbbell, BarChart3, BookOpen, User } from 'lucide-react';
import { getUserProfile } from '../utils/progressTracker';

const LandingPage = ({ onNavigate }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userProfile = getUserProfile();
    setProfile(userProfile);
  }, []);

  const isSignedIn = profile && profile.name;

  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat text-black p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="flex justify-end mb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white/100 transition-all transform hover:scale-105 shadow-2xl text-black border border-gray-300">
            <User size={20} />
            {isSignedIn ? 'Profile' : 'Sign in'}
          </button>
        </div>
        <div className="text-center mb-12">
          <Dumbbell size={64} className="mx-auto mb-4 text-black" />
          <h1 className="text-5xl font-bold mb-3 text-black">Training Program</h1>
          <p className="text-xl text-black">v 0.1.0</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          <button
            onClick={() => onNavigate('/workouts')}
            className="bg-white/90 hover:bg-white/100 transition-all transform hover:scale-105 shadow-2xl p-8 cursor-pointer flex flex-col items-center border border-gray-300"
            aria-label="Go to workouts"
          >
            <Dumbbell size={48} className="mb-4 text-black" />
            <h2 className="text-2xl font-bold mb-2 text-black">Workouts</h2>
            <p className="text-sm text-black">Choose from a variety of workout routines and track your progress</p>
          </button>

          <button
            onClick={() => onNavigate('/tracking')}
            className="bg-white/90 hover:bg-white/100 transition-all transform hover:scale-105 shadow-2xl p-8 cursor-pointer flex flex-col items-center border border-gray-300"
            aria-label="Go to tracking"
          >
            <BookOpen size={48} className="mb-4 text-black" />
            <h2 className="text-2xl font-bold mb-2 text-black">Tracking</h2>
            <p className="text-sm text-black">Track your daily metrics including sleep, weight, steps, and nutrition</p>
          </button>

          <button
            onClick={() => onNavigate('/dashboard')}
            className="bg-white/90 hover:bg-white/100 transition-all transform hover:scale-105 shadow-2xl p-8 cursor-pointer flex flex-col items-center border border-gray-300"
            aria-label="Go to progress dashboard"
          >
            <BarChart3 size={48} className="mb-4 text-black" />
            <h2 className="text-2xl font-bold mb-2 text-black">Progress Dashboard</h2>
            <p className="text-sm text-black">Visualize your progress with detailed charts and statistics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;