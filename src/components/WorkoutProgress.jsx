import React, { useMemo } from 'react';
import { Check } from 'lucide-react';
import { formatTime } from '../utils/workoutUtils';

// Helper to identify superset pairs based on group naming convention (e.g., "D1" and "D2")
const getSupersetPairs = (exercises) => {
  const supersetPairs = [];
  const processed = new Set();

  exercises.forEach((exercise, idx) => {
    const group = exercise.group;
    if (group && (group.endsWith('1') || group.endsWith('2'))) {
      const baseGroup = group.replace(/[12]/, '');
      
      if (!processed.has(idx) && !processed.has(baseGroup + '1') && !processed.has(baseGroup + '2')) {
        // Find the paired exercise
        const pairIdx = exercises.findIndex((ex, i) => 
          i !== idx && ex.group && ex.group.replace(/[12]/, '') === baseGroup
        );
        
        if (pairIdx !== -1) {
          supersetPairs.push({
            first: Math.min(idx, pairIdx),
            second: Math.max(idx, pairIdx)
          });
          processed.add(idx);
          processed.add(pairIdx);
        }
      }
    }
  });

  return supersetPairs;
};

// Helper to check if an exercise is part of a superset
const isInSuperset = (index, supersetPairs) => {
  return supersetPairs.some(pair => pair.first === index || pair.second === index);
};

// Helper to get superset pair for an index
const getSupersetPair = (index, supersetPairs) => {
  return supersetPairs.find(pair => pair.first === index || pair.second === index);
};

const WorkoutProgress = ({
  exercises,
  currentExerciseIndex,
  skipToExercise,
  skipToSet,
  isSetCompleted,
  isResting,
  timeLeft,
  currentSet,
  completeSet,
  completeSetFromRest
}) => {
  const supersetPairs = useMemo(() => getSupersetPairs(exercises), [exercises]);

  // Group exercises: supersets together, singles standalone
  const groupedExercises = useMemo(() => {
    const groups = [];
    const processed = new Set();

    exercises.forEach((exercise, idx) => {
      if (processed.has(idx)) return;

      const pair = getSupersetPair(idx, supersetPairs);
      if (pair) {
        // This is a superset pair
        groups.push({
          type: 'superset',
          indices: [pair.first, pair.second],
          exercises: [exercises[pair.first], exercises[pair.second]]
        });
        processed.add(pair.first);
        processed.add(pair.second);
      } else {
        // Single exercise
        groups.push({
          type: 'single',
          indices: [idx],
          exercises: [exercise]
        });
        processed.add(idx);
      }
    });

    return groups;
  }, [exercises, supersetPairs]);

  return (
    <div className="bg-white/90 transition-all shadow-2xl p-6 border border-gray-300">
      <h3 className="text-xl font-bold mb-4 text-black">Workout Progress</h3>
      <div className="space-y-2">
        {groupedExercises.map((group, groupIdx) => {
          if (group.type === 'superset') {
            // Render superset as a boxed group
            return (
              <div
                key={`superset-${groupIdx}`}
                className="border-2 border-gray-300 shadow-2xl overflow-hidden"
              >
                {group.exercises.map((exercise, exIdx) => {
                  const idx = group.indices[exIdx];
                  const isCurrent = idx === currentExerciseIndex;
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => skipToExercise(idx)}
                      className={`p-4 cursor-pointer transition-all ${
                        isCurrent ? 'bg-white border-b border-gray-300' : 'bg-white/90 hover:bg-white/100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-black">{exercise.group}</span>
                            <span className="font-semibold text-black">{exercise.name}</span>
                          </div>
                          <p className="text-sm text-black">
                            {exercise.sets} x {exercise.reps} | {exercise.rest}s rest
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
                              className={`px-2 py-1 text-xs cursor-pointer transition-all transform shadow-2xl border ${
                                isSetCompleted(idx, i + 1)
                                  ? 'bg-green-600 hover:bg-green-500 text-black border-gray-400'
                                  : 'bg-white/90 hover:bg-white/100 text-black border-gray-300'
                              }`}
                              title={`Go to Set ${i + 1}`}
                              aria-label={`Go to set ${i + 1} of ${exercise.name}`}
                            >
                              Set {i + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Show current exercise details and controls */}
                      {isCurrent && (
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-lg text-black">Set {currentSet} of {exercise.sets}</span>
                          </div>
                          
                          {isResting ? (
                            <div className="text-center mb-4">
                              <div className="text-4xl font-bold mb-2 text-black">
                                {formatTime(timeLeft)}
                              </div>
                              <p className="text-black">{timeLeft < 0 ? 'Overtime!' : 'Rest Time'}</p>

                              <div className="mt-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    completeSetFromRest();
                                  }}
                                  className="w-full bg-white/90 hover:bg-white/100 py-2 font-semibold flex items-center justify-center gap-2 transition-all transform shadow-2xl text-black border border-gray-300"
                                  aria-label={`Complete set ${currentSet} during rest`}
                                >
                                  <Check size={20} />
                                  Completed Set {currentSet}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  completeSet();
                                }}
                                className="w-full bg-white/90 hover:bg-white/100 py-2 font-semibold flex items-center justify-center gap-2 transition-all transform shadow-2xl text-black border border-gray-300"
                                aria-label={`Complete set ${currentSet}`}
                              >
                                <Check size={20} />
                                Completed Set {currentSet}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          } else {
            // Single exercise
            const idx = group.indices[0];
            const exercise = group.exercises[0];
            const isCurrent = idx === currentExerciseIndex;
            
            return (
              <div
                key={idx}
                onClick={() => skipToExercise(idx)}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  isCurrent
                    ? 'bg-white shadow-3xl border-yellow-500'
                    : 'bg-white/90 hover:bg-white/100 transform shadow-2xl border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-black">{exercise.group}</span>
                      <span className="font-semibold text-black">{exercise.name}</span>
                    </div>
                    <p className="text-sm text-black">
                      {exercise.sets} x {exercise.reps} | {exercise.rest}s rest
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
                        className={`px-2 py-1 text-xs cursor-pointer transition-all transform shadow-2xl border ${
                          isSetCompleted(idx, i + 1)
                            ? 'bg-green-600 hover:bg-green-500 text-black border-gray-400'
                            : 'bg-white/90 hover:bg-white/100 text-black border-gray-300'
                        }`}
                        title={`Go to Set ${i + 1}`}
                        aria-label={`Go to set ${i + 1} of ${exercise.name}`}
                      >
                        Set {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Show current exercise details and controls */}
                {isCurrent && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-lg text-black">Set {currentSet} of {exercise.sets}</span>
                    </div>
                    
                    {isResting ? (
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold mb-2 text-black">
                          {formatTime(timeLeft)}
                        </div>
                        <p className="text-black">{timeLeft < 0 ? 'Overtime!' : 'Rest Time'}</p>

                        <div className="mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              completeSetFromRest();
                            }}
                            className="w-full bg-white/90 hover:bg-white/100 py-2 font-semibold flex items-center justify-center gap-2 transition-all transform shadow-2xl text-black border border-gray-300"
                            aria-label={`Complete set ${currentSet} during rest`}
                          >
                            <Check size={20} />
                            Completed Set {currentSet}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            completeSet();
                          }}
                          className="w-full bg-white/90 hover:bg-white/100 py-2 font-semibold flex items-center justify-center gap-2 transition-all transform shadow-2xl text-black border border-gray-300"
                          aria-label={`Complete set ${currentSet}`}
                        >
                          <Check size={20} />
                          Completed Set {currentSet}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default WorkoutProgress;
