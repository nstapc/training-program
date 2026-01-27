import React from 'react';

const WorkoutProgress = ({
  exercises,
  currentExerciseIndex,
  colors,
  skipToExercise,
  skipToSet,
  isSetCompleted
}) => {
  return (
    <div className={`${colors.card} rounded-2xl p-6 border`}>
      <h3 className="text-xl font-bold mb-4">Workout Progress</h3>
      <div className="space-y-2">
        {exercises.map((exercise, idx) => (
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
                  className={`px-2 py-1 text-xs rounded cursor-pointer transition-all ${
                    isSetCompleted(idx, i + 1)
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-slate-600 hover:bg-blue-500 text-white'
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