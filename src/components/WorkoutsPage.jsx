import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Check, ChevronRight, Dumbbell, SkipForward, ChevronLeft, BarChart3, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workouts } from '../data/workouts';
import { validateWorkoutData, handleSupersetNavigation, handleNormalProgression, formatTime } from '../utils/workoutUtils';
import { saveWorkoutToHistory, logExerciseSet, getUserProfile } from '../utils/progressTracker';
import { playLyreSound, canPlayAudio } from '../utils/audioUtils';
import WorkoutProgress from './WorkoutProgress';

const WorkoutsPage = ({ onBack, initialWorkout }) => {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState(initialWorkout || null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState({});
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userProfile = getUserProfile();
    setProfile(userProfile);
  }, []);

  const isSignedIn = profile && profile.name;

  const currentWorkout = selectedWorkout ? workouts[selectedWorkout] : null;
  const currentExercise = currentWorkout?.exercises[currentExerciseIndex];

  // Memoize current workout data to avoid unnecessary recalculations
  const workoutData = useMemo(() => {
    if (!currentWorkout) return null;
    return {
      exercises: currentWorkout.exercises,
      totalExercises: currentWorkout.exercises.length,
      name: currentWorkout.name,
      description: currentWorkout.description
    };
  }, [currentWorkout]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && currentExercise) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          // Play sound when rest time reaches 0
          if (prev === 1) {
            playLyreSound();
          }
          // Allow overtime to continue counting indefinitely
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, currentExercise]);


  const applyNavigationResult = (result) => {
    if (result) {
      setCurrentExerciseIndex(result.newExerciseIndex);
      setCurrentSet(result.newSet);
      setIsResting(result.shouldRest);
      setTimeLeft(result.timeLeft);
      setIsTimerRunning(result.isTimerRunning);
      return true;
    }
    return false;
  };

  const completeSetFromRest = () => {
    const key = `${selectedWorkout}-${currentExerciseIndex}-${currentSet}`;
    setCompletedSets(prev => ({ ...prev, [key]: true }));

    // Try superset navigation first
    const supersetResult = handleSupersetNavigation({
      exercises: currentWorkout.exercises,
      currentExerciseIndex,
      currentSet,
      completedSets,
      workoutKey: selectedWorkout,
      fromRest: true
    });

    if (applyNavigationResult(supersetResult)) return;

    // If not a superset or superset logic didn't handle it, use normal progression
    const normalResult = handleNormalProgression({
      currentExerciseIndex,
      currentSet,
      totalExercises: currentWorkout.exercises.length,
      exerciseSets: currentExercise.sets,
      restTime: currentExercise.rest,
      fromRest: true
    });

    applyNavigationResult(normalResult);
  };

  const completeSet = () => {
    const key = `${selectedWorkout}-${currentExerciseIndex}-${currentSet}`;
    setCompletedSets(prev => ({ ...prev, [key]: true }));

    // Log the completed set for progress tracking
    const exercise = currentWorkout.exercises[currentExerciseIndex];
    logExerciseSet(
      currentWorkout.name,
      exercise.name,
      currentSet,
      null, // weight not tracked yet
      parseInt(exercise.reps.split('-')[1] || exercise.reps), // use max rep range or exact reps
      `Completed set ${currentSet}`
    );

    // Try superset navigation first
    const supersetResult = handleSupersetNavigation({
      exercises: currentWorkout.exercises,
      currentExerciseIndex,
      currentSet,
      completedSets,
      workoutKey: selectedWorkout,
      fromRest: false
    });

    if (applyNavigationResult(supersetResult)) return;

    // If not a superset or superset logic didn't handle it, use normal progression
    const normalResult = handleNormalProgression({
      currentExerciseIndex,
      currentSet,
      totalExercises: currentWorkout.exercises.length,
      exerciseSets: currentExercise.sets,
      restTime: currentExercise.rest,
      fromRest: false
    });

    applyNavigationResult(normalResult);
  };

  const skipToSet = (setNum) => {
    setCurrentSet(setNum);
    setIsResting(false);
    setTimeLeft(0);
    setIsTimerRunning(false);
  };

  const skipToExercise = (index) => {
    setCurrentExerciseIndex(index);
    setCurrentSet(1);
    setIsResting(false);
    setTimeLeft(0);
    setIsTimerRunning(false);
  };

  const selectWorkout = (workoutKey) => {
    try {
      validateWorkoutData(workouts[workoutKey]);
      // Use React Router navigate to go to the specific workout URL
      navigate(`/workouts/${workoutKey}`);
    } catch (error) {
      console.error('Invalid workout data:', error.message);
      // Could show error to user in a real app
    }
  };

  const backToMenu = () => {
    setSelectedWorkout(null);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setIsResting(false);
    setTimeLeft(0);
    setIsTimerRunning(false);
  };

  const isSetCompleted = (exerciseIdx, setNum) => {
    return completedSets[`${selectedWorkout}-${exerciseIdx}-${setNum}`];
  };

  if (!selectedWorkout) {
    return (
      <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat text-black p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onBack}
              className="text-sm px-4 py-2 bg-white/90 hover:bg-white/100 transition-all transform hover:scale-105 shadow-2xl text-black border border-gray-300"
              aria-label="Back"
            >
              ← Back
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white/100 transition-all transform hover:scale-105 shadow-2xl text-black border border-gray-300">
            <User size={20} />
            {isSignedIn ? 'Profile' : 'Sign in'}
          </button>
          </div>
          <div className="text-center mb-12">
            <Dumbbell size={64} className="mx-auto mb-4 text-black" />
            <br></br>
            <h1 className="text-5xl font-bold mb-3 text-black">Select a workout</h1>
            <br></br>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {Object.entries(workouts).map(([workoutKey, workout]) => (
              <button
                key={workoutKey}
                onClick={() => selectWorkout(workoutKey)}
                className="bg-white/90 hover:bg-white/100 transition-all transform hover:scale-105 shadow-2xl p-8 cursor-pointer flex flex-col w-full text-left border border-gray-300"
                aria-label={`Select ${workout.name}`}
              >
                <div className="text-left flex-1">
                  <h2 className="text-3xl font-bold mb-2 text-black">{workout.name}</h2>
                  <p className="text-sm mb-4 text-black">{workout.description}</p>
                  <div className="space-y-1 text-sm text-black">
                    {workout.exercises.map((exercise, index) => (
                      <p key={index}>• {exercise.name}</p>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat text-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={backToMenu}
            className="text-sm px-4 py-2 bg-white/90 hover:bg-white/100 transition-all transform hover:scale-105 shadow-2xl text-black border border-gray-300"
            aria-label="Back"
          >
            ← Back
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white/100 transition-all transform hover:scale-105 shadow-2xl text-black border border-gray-300">
            <User size={20} />
            {isSignedIn ? 'Profile' : 'Sign in'}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-black">{currentWorkout.name}</h1>
        <p className="text-center text-black mb-8">{currentWorkout.description}</p>

        <WorkoutProgress
          exercises={currentWorkout.exercises}
          currentExerciseIndex={currentExerciseIndex}
          completedSets={completedSets}
          skipToExercise={skipToExercise}
          skipToSet={skipToSet}
          isSetCompleted={isSetCompleted}
          isResting={isResting}
          timeLeft={timeLeft}
          currentSet={currentSet}
          completeSet={completeSet}
          completeSetFromRest={completeSetFromRest}
        />
      </div>
    </div>
  );
};

export default WorkoutsPage;