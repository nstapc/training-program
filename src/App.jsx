import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, ChevronRight, Dumbbell, SkipForward, ChevronLeft } from 'lucide-react';
import { workouts } from './data/workouts';
import { validateWorkoutData, handleSupersetNavigation, handleNormalProgression, formatTime } from './utils/workoutUtils';
import WorkoutProgress from './components/WorkoutProgress';

const WorkoutTracker = () => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState({});

  const currentWorkout = selectedWorkout ? workouts[selectedWorkout] : null;
  const currentExercise = currentWorkout?.exercises[currentExerciseIndex];

  useEffect(() => {
    let interval;
    if (isTimerRunning && currentExercise) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
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

  const getColorClasses = (color) => {
    const colorConfigs = {
      blue: {
        bg: 'from-slate-900 to-slate-800',
        card: 'bg-slate-800 border-slate-700',
        primary: 'bg-blue-600 hover:bg-blue-700',
        secondary: 'bg-slate-700 hover:bg-slate-600',
        text: 'text-blue-400',
        textLight: 'text-slate-400',
        dot: 'bg-blue-500',
        dotInactive: 'bg-slate-600',
        listActive: 'bg-blue-600',
        listInactive: 'bg-slate-700'
      },
      green: {
        bg: 'from-slate-900 to-green-900',
        card: 'bg-slate-800 border-green-700',
        primary: 'bg-green-600 hover:bg-green-700',
        secondary: 'bg-slate-700 hover:bg-slate-600',
        text: 'text-green-400',
        textLight: 'text-slate-300',
        dot: 'bg-green-500',
        dotInactive: 'bg-slate-600',
        listActive: 'bg-green-600',
        listInactive: 'bg-slate-700'
      },
      orange: {
        bg: 'from-slate-900 to-orange-900',
        card: 'bg-slate-800 border-orange-700',
        primary: 'bg-orange-600 hover:bg-orange-700',
        secondary: 'bg-slate-700 hover:bg-slate-600',
        text: 'text-orange-400',
        textLight: 'text-slate-300',
        dot: 'bg-orange-500',
        dotInactive: 'bg-slate-600',
        listActive: 'bg-orange-600',
        listInactive: 'bg-slate-700'
      },
      purple: {
        bg: 'from-slate-900 to-purple-900',
        card: 'bg-slate-800 border-purple-700',
        primary: 'bg-purple-600 hover:bg-purple-700',
        secondary: 'bg-slate-700 hover:bg-slate-600',
        text: 'text-purple-400',
        textLight: 'text-slate-300',
        dot: 'bg-purple-500',
        dotInactive: 'bg-slate-600',
        listActive: 'bg-purple-600',
        listInactive: 'bg-slate-700'
      },
      red: {
        bg: 'from-slate-900 to-red-900',
        card: 'bg-slate-800 border-red-700',
        primary: 'bg-red-600 hover:bg-red-700',
        secondary: 'bg-slate-700 hover:bg-slate-600',
        text: 'text-red-400',
        textLight: 'text-slate-300',
        dot: 'bg-red-500',
        dotInactive: 'bg-slate-600',
        listActive: 'bg-red-600',
        listInactive: 'bg-slate-700'
      },
      indigo: {
        bg: 'from-slate-900 to-indigo-900',
        card: 'bg-slate-800 border-indigo-700',
        primary: 'bg-indigo-600 hover:bg-indigo-700',
        secondary: 'bg-slate-700 hover:bg-slate-600',
        text: 'text-indigo-400',
        textLight: 'text-slate-300',
        dot: 'bg-indigo-500',
        dotInactive: 'bg-slate-600',
        listActive: 'bg-indigo-600',
        listInactive: 'bg-slate-700'
      }
    };

    return colorConfigs[color] || colorConfigs.indigo;
  };

  if (!selectedWorkout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <Dumbbell size={64} className="mx-auto mb-4 text-gray-400" />
            <br></br>
            <h1 className="text-5xl font-bold mb-3">Select a workout</h1>
            <br></br>
            {/* <p className="text-xl text-gray-400">Select a workout</p> */}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {Object.entries(workouts).map(([workoutKey, workout]) => (
              <button
                key={workoutKey}
                onClick={() => selectWorkout(workoutKey)}
                className={`bg-gradient-to-br from-slate-800 to-slate-900 border-2 rounded-2xl p-8 hover:opacity-90 transition-all transform hover:scale-105 ${
                  workout.color === 'blue' ? 'border-blue-500 hover:border-blue-400' :
                  workout.color === 'orange' ? 'from-slate-900 to-orange-900 border-orange-500 hover:border-orange-400' :
                  workout.color === 'green' ? 'from-slate-900 to-green-900 border-green-500 hover:border-green-400' :
                  workout.color === 'purple' ? 'from-slate-900 to-purple-900 border-purple-500 hover:border-purple-400' :
                  workout.color === 'red' ? 'from-slate-900 to-red-900 border-red-500 hover:border-red-400' :
                  'from-slate-900 to-indigo-900 border-indigo-500 hover:border-indigo-400'
                }`}
                aria-label={`Select ${workout.name}`}
              >
                <div className="text-left">
                  <h2 className={`text-3xl font-bold mb-2 ${
                    workout.color === 'blue' ? 'text-blue-400' :
                    workout.color === 'orange' ? 'text-orange-400' :
                    workout.color === 'green' ? 'text-green-400' :
                    workout.color === 'purple' ? 'text-purple-400' :
                    workout.color === 'red' ? 'text-red-400' :
                    'text-indigo-400'
                  }`}>{workout.name}</h2>
                  <p className={`text-sm mb-4 ${
                    workout.color === 'blue' ? 'text-gray-400' :
                    workout.color === 'orange' ? 'text-slate-300' :
                    workout.color === 'green' ? 'text-green-300' :
                    workout.color === 'purple' ? 'text-purple-300' :
                    workout.color === 'red' ? 'text-red-300' :
                    'text-indigo-300'
                  }`}>{workout.description}</p>
                  <div className={`space-y-1 text-sm ${
                    workout.color === 'blue' ? 'text-gray-300' :
                    workout.color === 'orange' ? 'text-slate-300' :
                    workout.color === 'green' ? 'text-green-300' :
                    workout.color === 'purple' ? 'text-purple-300' :
                    workout.color === 'red' ? 'text-red-300' :
                    'text-indigo-300'
                  }`}>
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

  const colors = getColorClasses(currentWorkout.color);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} text-white p-4`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={backToMenu}
            className="text-sm px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            aria-label="Back to workout menu"
          >
            ← Back to Menu
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">{currentWorkout.name}</h1>
        <p className={`text-center ${colors.textLight} mb-8`}>{currentWorkout.description}</p>

        <div className={`${colors.card} rounded-2xl p-8 mb-6 border`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-semibold ${colors.text}`}>{currentExercise.group}</span>
            <span className={`text-sm ${colors.textLight}`}>
              Exercise {currentExerciseIndex + 1} of {currentWorkout.exercises.length}
            </span>
          </div>

          <h2 className="text-4xl font-bold mb-2">{currentExercise.name}</h2>
          <p className="text-xl text-gray-300 mb-6">{currentExercise.reps} reps</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-lg">Set {currentSet} of {currentExercise.sets}</span>
            <div className="flex gap-2">
              {[...Array(currentExercise.sets)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => skipToSet(i + 1)}
                  className={`px-2 py-1 text-xs rounded cursor-pointer transition-all ${
                    isSetCompleted(currentExerciseIndex, i + 1)
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-slate-600 hover:bg-blue-500 text-white'
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
              <div className={`text-6xl font-bold mb-2 ${timeLeft < 0 ? 'text-red-400' : colors.text}`}>
                {formatTime(timeLeft)}
              </div>
              <p className={colors.textLight}>{timeLeft < 0 ? 'Overtime!' : 'Rest Time'}</p>

              <div className="mt-6">
              <button
                onClick={completeSetFromRest}
                className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
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
                className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
                aria-label={`Complete set ${currentSet}`}
              >
                <Check size={24} />
                Completed Set {currentSet}
              </button>
              {currentExerciseIndex > 0 && (
              <button
                onClick={previousExercise}
                className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
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
          colors={colors}
          skipToExercise={skipToExercise}
          skipToSet={skipToSet}
          isSetCompleted={isSetCompleted}
        />
      </div>
    </div>
  );
};

export default WorkoutTracker;