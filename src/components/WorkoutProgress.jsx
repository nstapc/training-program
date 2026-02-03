import React from 'react';

const WorkoutProgress = ({
  exercises,
  currentExerciseIndex,
  skipToExercise,
  skipToSet,
  isSetCompleted
}) => {
  return (
    <div className="bg-white/75 transition-all shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-black">Workout Progress</h3>
      <div className="space-y-2">
        {exercises.map((exercise, idx) => (
          <div
            key={idx}
            onClick={() => skipToExercise(idx)}
            className="p-4 cursor-pointer transition-all bg-white/75 hover:bg-white/100 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-black">{exercise.group}</span>
                  <span className="font-semibold text-black">{exercise.name}</span>
                </div>
                <p className="text-sm text-black">
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
                  className={`px-2 py-1 text-xs cursor-pointer transition-all transform hover:scale-105 shadow-lg ${
                    isSetCompleted(idx, i + 1)
                      ? 'bg-green-600 hover:bg-green-500 text-black'
                      : 'bg-white/75 hover:bg-white/100 text-black'
                  }`}
                  title={`Go to Set ${i + 1}`}
                  aria-label={`Go to set ${i + 1} of ${exercise.name}`}
                >
                  Set {i + 1}
                </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutProgress;
