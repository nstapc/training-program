import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Check, ChevronRight, Dumbbell, SkipForward, ChevronLeft, BarChart3, User } from 'lucide-react';
import { workouts } from '../data/workouts';
import { validateWorkoutData, handleSupersetNavigation, handleNormalProgression, formatTime } from '../utils/workoutUtils';
import { saveWorkoutToHistory, logExerciseSet, getUserProfile } from '../utils/progressTracker';
import { playLyreSound, canPlayAudio } from '../utils/audioUtils';
import WorkoutProgress from './WorkoutProgress';

const WorkoutsPage = ({ onBack }) => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
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

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setCurrentSet(1);
      setIsResting(false);
      setTimeLeft(0);
      setIsTimerRunning(false);
    }
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
      setSelectedWorkout(workoutKey);
      setCurrentExerciseIndex(0);
      setCurrentSet(1);
      setIsResting(false);
      setTimeLeft(0);
      setIsTimerRunning(false);
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
      <div className="min-h-screen bg-[url('background.png')] bg-cover bg-center bg-no-repeat text-black p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onBack}
              className="text-sm px-4 py-2 bg-white/75 hover:bg-white/100 transition-all transform hover:scale-105 shadow-lg text-black"
              aria-label="Back"
            >
              ← Back
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/75 hover:bg-white/100 transition-all transform hover:scale-105 shadow-lg text-black">
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
              <div
                key={workoutKey}
                onClick={() => selectWorkout(workoutKey)}
                className="bg-white/75 hover:bg-white/100 transition-all transform hover:scale-105 shadow-lg p-8 cursor-pointer flex flex-col"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('background.png')] bg-cover bg-center bg-no-repeat text-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={backToMenu}
            className="text-sm px-4 py-2 bg-white/75 hover:bg-white/100 transition-all transform hover:scale-105 shadow-lg text-black"
            aria-label="Back"
          >
            ← Back
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/75 hover:bg-white/100 transition-all transform hover:scale-105 shadow-lg text-black">
            <User size={20} />
            {isSignedIn ? 'Profile' : 'Sign in'}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-black">{currentWorkout.name}</h1>
        <p className="text-center text-black mb-8">{currentWorkout.description}</p>

        <div className="bg-white/75 transition-all shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-black">{currentExercise.group}</span>
            <span className="text-sm text-black">
              Exercise {currentExerciseIndex + 1} of {currentWorkout.exercises.length}
            </span>
          </div>

          <h2 className="text-4xl font-bold mb-2 text-black">{currentExercise.name}</h2>
          <p className="text-xl text-black mb-6">{currentExercise.reps} reps</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-lg text-black">Set {currentSet} of {currentExercise.sets}</span>
            <div className="flex gap-2">
              {[...Array(currentExercise.sets)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => skipToSet(i + 1)}
                  className={`px-2 py-1 text-xs cursor-pointer transition-all transform hover:scale-105 shadow-lg ${
                    isSetCompleted(currentExerciseIndex, i + 1)
                      ? 'bg-green-600 hover:bg-green-500 text-black'
                      : 'bg-white/75 hover:bg-white/100 text-black'
                  }`}
                  title={`Go to Set ${i + 1}`}
                >
                  Set {i + 1}
                </button>
              ))}
            </div>
          </div>

          {isResting ? (
            <div className="text-center mb-6">
              <div className="text-6xl font-bold mb-2 text-black">
                {formatTime(timeLeft)}
              </div>
              <p className="text-black">{timeLeft < 0 ? 'Overtime!' : 'Rest Time'}</p>

              <div className="mt-6">
              <button
                onClick={completeSetFromRest}
                className="w-full bg-white/75 hover:bg-white/100 py-4 font-semibold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg text-black"
                aria-label={`Complete set ${currentSet} during rest`}
              >
                <Check size={24} />
                Completed Set {currentSet}
              </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={completeSet}
                className="w-full bg-white/75 hover:bg-white/100 py-4 font-semibold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg text-black"
                aria-label={`Complete set ${currentSet}`}
              >
                <Check size={24} />
                Completed Set {currentSet}
              </button>
              {currentExerciseIndex > 0 && (
              <button
                onClick={previousExercise}
                className="w-full bg-white/75 hover:bg-white/100 py-4 font-semibold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg text-black"
                aria-label="Go to previous exercise"
              >
                <ChevronLeft size={20} />
                Previous Exercise
              </button>
              )}
            </div>
          )}
        </div>

        <WorkoutProgress
          exercises={currentWorkout.exercises}
          currentExerciseIndex={currentExerciseIndex}
          completedSets={completedSets}
          skipToExercise={skipToExercise}
          skipToSet={skipToSet}
          isSetCompleted={isSetCompleted}
        />
      </div>
    </div>
  );
};

export default WorkoutsPage;