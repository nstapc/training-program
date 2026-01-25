import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, ChevronRight, Dumbbell, SkipForward, ChevronLeft } from 'lucide-react';

const WorkoutTracker = () => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState({});

  const workouts = {
    day1: {
      name: 'Day 1 - OHP & Chin-ups',
      color: 'blue',
      description: 'Vertical Push/Pull Focus',
      exercises: [
        { name: 'Overhead Press', sets: 4, reps: '6-8', rest: 90, group: 'A1' },
        { name: 'Chin-ups', sets: 4, reps: '6-10', rest: 90, group: 'A2' },
        { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest: 90, group: 'B' },
        { name: 'Front Squat', sets: 3, reps: '8-12', rest: 90, group: 'C' },
        { name: 'Decline Push-ups', sets: 3, reps: '10-12', rest: 60, group: 'D1' },
        { name: 'DB Row', sets: 3, reps: '10-12', rest: 60, group: 'D2' },
        { name: 'Hanging Leg Raise', sets: 3, reps: '8-12', rest: 60, group: 'E' },
      ]
    },
    day2: {
      name: 'Day 2 - Bench & Row',
      color: 'orange',
      description: 'Horizontal Push/Pull & Posterior Chain',
      exercises: [
        { name: 'DB Row', sets: 4, reps: '6-8', rest: 90, group: 'A1' },
        { name: 'Slight Incline DB Bench Press', sets: 4, reps: '6-10', rest: 90, group: 'A2' },
        { name: 'DB Deadlift', sets: 3, reps: '5-8', rest: 120, group: 'B' },
        { name: 'Leg Extension', sets: 3, reps: '10-12', rest: 60, group: 'C1' },
        { name: 'Leg Curl', sets: 3, reps: '10-12', rest: 60, group: 'C2' },
        { name: 'DB Shoulder Press', sets: 3, reps: '10-12', rest: 60, group: 'D1' },
        { name: 'DB Face Pulls', sets: 3, reps: '12-15', rest: 60, group: 'D2' },
        { name: 'Exercise Ball Crunch', sets: 3, reps: '8-12', rest: 60, group: 'E' },
      ]
    }
  };

  const currentWorkout = selectedWorkout ? workouts[selectedWorkout] : null;
  const currentExercise = currentWorkout?.exercises[currentExerciseIndex];

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startRest = () => {
    setTimeLeft(currentExercise.rest);
    setIsResting(true);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimeLeft(currentExercise.rest);
    setIsTimerRunning(false);
  };

  const skipRest = () => {
    setTimeLeft(0);
    setIsTimerRunning(false);
    setIsResting(false);
  };

  const completeSetFromRest = () => {
    const key = `${selectedWorkout}-${currentExerciseIndex}-${currentSet}`;
    setCompletedSets(prev => ({ ...prev, [key]: true }));
    
    // Check if current exercise is part of a superset
    const currentGroup = currentExercise.group;
    const isSuperset = currentGroup.includes('1') || currentGroup.includes('2');
    const baseGroup = currentGroup.replace(/[12]/, '');
    
    if (isSuperset) {
      // Find the paired exercise
      const pairedExercise = currentWorkout.exercises.find((ex, idx) => 
        idx !== currentExerciseIndex && 
        ex.group.startsWith(baseGroup) && 
        ex.group !== currentGroup
      );
      
      if (pairedExercise) {
        const pairedIndex = currentWorkout.exercises.indexOf(pairedExercise);
        const pairedKey = `${selectedWorkout}-${pairedIndex}-${currentSet}`;
        const isPairedCompleted = completedSets[pairedKey];
        
        // If paired exercise for this set is not completed, go to it with no rest
        if (!isPairedCompleted) {
          setCurrentExerciseIndex(pairedIndex);
          setIsResting(false);
          setTimeLeft(0);
          setIsTimerRunning(false);
          return;
        }
        
        // Both exercises completed current set - move to next set
        if (currentSet < currentExercise.sets) {
          // Find which exercise comes first (has '1' in group)
          const firstExerciseIndex = currentGroup.includes('1') ? currentExerciseIndex : pairedIndex;
          setCurrentExerciseIndex(firstExerciseIndex);
          setCurrentSet(currentSet + 1);
          setTimeLeft(currentWorkout.exercises[firstExerciseIndex].rest);
          setIsResting(true);
          setIsTimerRunning(true);
          return;
        } else {
          // All sets complete, move to next exercise
          const maxIndex = Math.max(currentExerciseIndex, pairedIndex);
          if (maxIndex < currentWorkout.exercises.length - 1) {
            setCurrentExerciseIndex(maxIndex + 1);
            setCurrentSet(1);
            setIsResting(false);
            setTimeLeft(0);
            setIsTimerRunning(false);
          } else {
            setIsResting(false);
            setIsTimerRunning(false);
            setTimeLeft(0);
          }
          return;
        }
      }
    }
    
    // Normal flow: move to next set or exercise (non-superset)
    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
      setTimeLeft(currentExercise.rest);
      setIsResting(true);
      setIsTimerRunning(true);
    } else {
      if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
        setIsResting(false);
        setTimeLeft(0);
        setIsTimerRunning(false);
      } else {
        setIsResting(false);
        setIsTimerRunning(false);
        setTimeLeft(0);
      }
    }
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
    
    // Check if current exercise is part of a superset
    const currentGroup = currentExercise.group;
    const isSuperset = currentGroup.includes('1') || currentGroup.includes('2');
    const baseGroup = currentGroup.replace(/[12]/, '');
    
    if (isSuperset) {
      // Find the paired exercise
      const pairedExercise = currentWorkout.exercises.find((ex, idx) => 
        idx !== currentExerciseIndex && 
        ex.group.startsWith(baseGroup) && 
        ex.group !== currentGroup
      );
      
      if (pairedExercise) {
        const pairedIndex = currentWorkout.exercises.indexOf(pairedExercise);
        const pairedKey = `${selectedWorkout}-${pairedIndex}-${currentSet}`;
        const isPairedCompleted = completedSets[pairedKey];
        
        // If paired exercise for this set is not completed, go to it with no rest
        if (!isPairedCompleted) {
          setCurrentExerciseIndex(pairedIndex);
          setIsResting(false);
          setTimeLeft(0);
          setIsTimerRunning(false);
          return;
        }
        
        // Both exercises completed current set - move to next set
        if (currentSet < currentExercise.sets) {
          // Find which exercise comes first (has '1' in group)
          const firstExerciseIndex = currentGroup.includes('1') ? currentExerciseIndex : pairedIndex;
          setCurrentExerciseIndex(firstExerciseIndex);
          setCurrentSet(currentSet + 1);
          startRest();
          return;
        } else {
          // All sets complete, move to next exercise
          const maxIndex = Math.max(currentExerciseIndex, pairedIndex);
          if (maxIndex < currentWorkout.exercises.length - 1) {
            setCurrentExerciseIndex(maxIndex + 1);
            setCurrentSet(1);
            setIsResting(false);
            setTimeLeft(0);
            setIsTimerRunning(false);
          }
          return;
        }
      }
    }
    
    // Normal flow: move to next set or exercise (non-superset)
    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
      startRest();
    } else {
      if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
        setIsResting(false);
        setTimeLeft(0);
        setIsTimerRunning(false);
      }
    }
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
    setSelectedWorkout(workoutKey);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setIsResting(false);
    setTimeLeft(0);
    setIsTimerRunning(false);
  };

  const backToMenu = () => {
    setSelectedWorkout(null);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setIsResting(false);
    setTimeLeft(0);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${isNegative ? '+' : ''}${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isSetCompleted = (exerciseIdx, setNum) => {
    return completedSets[`${selectedWorkout}-${exerciseIdx}-${setNum}`];
  };

  const getColorClasses = (color) => {
    if (color === 'blue') {
      return {
        bg: 'from-slate-900 to-slate-800',
        card: 'bg-slate-800 border-slate-700',
        primary: 'bg-blue-600 hover:bg-blue-700',
        secondary: 'bg-slate-700 hover:bg-slate-600',
        text: 'text-blue-400',
        textLight: 'text-slate-400',
        dot: 'bg-blue-500',
        dotInactive: 'bg-slate-600',
        listActive: 'bg-blue-600',
        listInactive: 'bg-slate-700 hover:bg-slate-600'
      };
    } else {
      return {
        bg: 'from-slate-900 to-orange-900',
        card: 'bg-slate-800 border-orange-700',
        primary: 'bg-orange-600 hover:bg-orange-700',
        secondary: 'bg-slate-700 hover:bg-slate-600',
        text: 'text-orange-400',
        textLight: 'text-slate-300',
        dot: 'bg-orange-500',
        dotInactive: 'bg-slate-600',
        listActive: 'bg-orange-600',
        listInactive: 'bg-slate-700 hover:bg-slate-600'
      };
    }
  };

  if (!selectedWorkout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <Dumbbell size={64} className="mx-auto mb-4 text-gray-400" />
            <h1 className="text-5xl font-bold mb-3">Full Body Program</h1>
            <p className="text-xl text-gray-400">Select your workout for today</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => selectWorkout('day1')}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500 rounded-2xl p-8 hover:border-blue-400 transition-all transform hover:scale-105"
            >
              <div className="text-left">
                <h2 className="text-3xl font-bold mb-2 text-blue-400">Day 1</h2>
                <p className="text-xl font-semibold mb-3">OHP & Chin-ups</p>
                <p className="text-gray-400 mb-4">Vertical Push/Pull Focus</p>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>• Overhead Press</p>
                  <p>• Chin-ups</p>
                  <p>• Romanian Deadlift</p>
                  <p>• Front Squat</p>
                  <p>+ 3 more exercises</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => selectWorkout('day2')}
              className="bg-gradient-to-br from-slate-900 to-orange-900 border-2 border-orange-500 rounded-2xl p-8 hover:border-orange-400 transition-all transform hover:scale-105"
            >
              <div className="text-left">
                <h2 className="text-3xl font-bold mb-2 text-orange-400">Day 2</h2>
                <p className="text-xl font-semibold mb-3">Bench & Row</p>
                <p className="text-slate-300 mb-4">Horizontal Push/Pull & Posterior Chain</p>
                <div className="space-y-1 text-sm text-slate-300">
                  <p>• DB Row</p>
                  <p>• Slight Incline DB Bench Press</p>
                  <p>• DB Deadlift</p>
                  <p>• Leg Extension/Curl</p>
                  <p>+ 4 more exercises</p>
                </div>
              </div>
            </button>
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
            <div className="flex gap-3">
              {[...Array(currentExercise.sets)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => skipToSet(i + 1)}
                  className={`w-6 h-6 rounded-full transition-all ${
                    isSetCompleted(currentExerciseIndex, i + 1)
                      ? 'bg-green-400 hover:bg-green-500'
                      : i + 1 === currentSet
                      ? `${colors.dot} hover:opacity-80`
                      : `${colors.dotInactive} hover:opacity-80`
                  } cursor-pointer`}
                  title={`Go to Set ${i + 1}`}
                />
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
              >
                <Check size={24} />
                Completed Set {currentSet}
              </button>
              {currentExerciseIndex > 0 && (
                <button
                  onClick={previousExercise}
                  className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <ChevronLeft size={20} />
                  Previous Exercise
                </button>
              )}
            </div>
          )}
        </div>

        <div className={`${colors.card} rounded-2xl p-6 border`}>
          <h3 className="text-xl font-bold mb-4">Workout Progress</h3>
          <div className="space-y-2">
            {currentWorkout.exercises.map((exercise, idx) => (
              <div
                key={idx}
                onClick={() => skipToExercise(idx)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  idx === currentExerciseIndex
                    ? colors.listActive
                    : colors.listInactive
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${colors.textLight}`}>{exercise.group}</span>
                      <span className="font-semibold">{exercise.name}</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {exercise.sets} × {exercise.reps} | {exercise.rest}s rest
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {[...Array(exercise.sets)].map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          skipToExercise(idx);
                          skipToSet(i + 1);
                        }}
                        className={`w-4 h-4 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                          isSetCompleted(idx, i + 1) ? 'bg-green-400' : colors.dotInactive
                        }`}
                        title={`Go to Set ${i + 1}`}
                      />
                    ))}
                  </div>
                  {idx === currentExerciseIndex && <ChevronRight size={20} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTracker;