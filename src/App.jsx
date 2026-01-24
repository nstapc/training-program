import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, ChevronRight } from 'lucide-react';

const WorkoutTracker = () => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState({});

  const exercises = [
    { name: 'Overhead Press', sets: 4, reps: '6-8', rest: 90, group: 'A1' },
    { name: 'Chin-ups', sets: 4, reps: '6-10', rest: 90, group: 'A2' },
    { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest: 90, group: 'B' },
    { name: 'Front Squat', sets: 3, reps: '8-12', rest: 90, group: 'C' },
    { name: 'Decline Push-ups', sets: 3, reps: '10-12', rest: 60, group: 'D1' },
    { name: 'DB Row', sets: 3, reps: '10-12', rest: 60, group: 'D2' },
    { name: 'Hanging Leg Raise', sets: 3, reps: '8-12', rest: 60, group: 'E' },
  ];

  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

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

  const completeSet = () => {
    const key = `${currentExerciseIndex}-${currentSet}`;
    setCompletedSets(prev => ({ ...prev, [key]: true }));
    
    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
      startRest();
    } else {
      // Move to next exercise
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
        setIsResting(false);
        setTimeLeft(0);
        setIsTimerRunning(false);
      }
    }
  };

  const skipToExercise = (index) => {
    setCurrentExerciseIndex(index);
    setCurrentSet(1);
    setIsResting(false);
    setTimeLeft(0);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isSetCompleted = (exerciseIdx, setNum) => {
    return completedSets[`${exerciseIdx}-${setNum}`];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Full Body Workout</h1>
        <p className="text-center text-slate-400 mb-8">OHP & Chin-up Focus</p>

        {/* Main Exercise Card */}
        <div className="bg-slate-800 rounded-2xl p-8 mb-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-blue-400">{currentExercise.group}</span>
            <span className="text-sm text-slate-400">
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </span>
          </div>
          
          <h2 className="text-4xl font-bold mb-2">{currentExercise.name}</h2>
          <p className="text-xl text-slate-300 mb-6">{currentExercise.reps} reps</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-lg">Set {currentSet} of {currentExercise.sets}</span>
            <div className="flex gap-2">
              {[...Array(currentExercise.sets)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    isSetCompleted(currentExerciseIndex, i + 1)
                      ? 'bg-green-500'
                      : i + 1 === currentSet
                      ? 'bg-blue-500'
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {isResting ? (
            <div className="text-center mb-6">
              <div className="text-6xl font-bold mb-2 text-blue-400">
                {formatTime(timeLeft)}
              </div>
              <p className="text-slate-400">Rest Time</p>
              
              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={toggleTimer}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                  {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                  {isTimerRunning ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={resetTimer}
                  className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={completeSet}
              className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Check size={24} />
              Complete Set {currentSet}
            </button>
          )}
        </div>

        {/* Exercise List */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-4">Workout Progress</h3>
          <div className="space-y-2">
            {exercises.map((exercise, idx) => (
              <div
                key={idx}
                onClick={() => skipToExercise(idx)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  idx === currentExerciseIndex
                    ? 'bg-blue-600'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">{exercise.group}</span>
                      <span className="font-semibold">{exercise.name}</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      {exercise.sets} × {exercise.reps} | {exercise.rest}s rest
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(exercise.sets)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          isSetCompleted(idx, i + 1) ? 'bg-green-500' : 'bg-slate-600'
                        }`}
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