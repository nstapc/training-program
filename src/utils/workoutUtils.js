/**
 * Workout utility functions for handling workout progression logic
 * and data validation
 */

/**
 * Find the paired exercise in a superset
 * @param {Array} exercises - Array of exercises
 * @param {number} currentIndex - Current exercise index
 * @param {string} currentGroup - Current exercise group (e.g., 'A1')
 * @returns {Object|null} - The paired exercise object or null if not found
 */
export const findPairedExercise = (exercises, currentIndex, currentGroup) => {
  return exercises.find((ex, idx) =>
    idx !== currentIndex &&
    ex.group.startsWith(currentGroup.replace(/[12]/, '')) &&
    ex.group !== currentGroup
  );
};

/**
 * Handle superset navigation logic
 * @param {Object} params - Navigation parameters
 * @param {Array} exercises - Array of exercises
 * @param {number} currentExerciseIndex - Current exercise index
 * @param {number} currentSet - Current set number
 * @param {Object} completedSets - Object tracking completed sets
 * @param {string} workoutKey - Current workout key
 * @param {boolean} fromRest - Whether this is called from rest state
 * @returns {Object} - Updated state values
 */
export const handleSupersetNavigation = ({
  exercises,
  currentExerciseIndex,
  currentSet,
  completedSets,
  workoutKey
}) => {
  const currentExercise = exercises[currentExerciseIndex];
  const currentGroup = currentExercise.group;
  const isSuperset = currentGroup.includes('1') || currentGroup.includes('2');

  if (isSuperset) {
    const pairedExercise = findPairedExercise(exercises, currentExerciseIndex, currentGroup);

    if (pairedExercise) {
      const pairedIndex = exercises.indexOf(pairedExercise);
      const pairedKey = `${workoutKey}-${pairedIndex}-${currentSet}`;
      const isPairedCompleted = completedSets[pairedKey];

      // If paired exercise for this set is not completed, go to it with no rest
      if (!isPairedCompleted) {
        return {
          newExerciseIndex: pairedIndex,
          newSet: currentSet,
          shouldRest: false,
          timeLeft: 0,
          isTimerRunning: false
        };
      }

      // Both exercises completed current set - move to next set
      if (currentSet < currentExercise.sets) {
        // Find which exercise comes first (has '1' in group)
        const firstExerciseIndex = currentGroup.includes('1') ? currentExerciseIndex : pairedIndex;
        // Use rest time from the second exercise (has '2' in group) as that's where the rest period is defined
        const secondExerciseIndex = currentGroup.includes('2') ? currentExerciseIndex : pairedIndex;
        return {
          newExerciseIndex: firstExerciseIndex,
          newSet: currentSet + 1,
          shouldRest: true,
          timeLeft: exercises[secondExerciseIndex].rest,
          isTimerRunning: true
        };
      } else {
        // All sets complete, move to next exercise
        const maxIndex = Math.max(currentExerciseIndex, pairedIndex);
        if (maxIndex < exercises.length - 1) {
          const nextExercise = exercises[maxIndex + 1];
          return {
            newExerciseIndex: maxIndex + 1,
            newSet: 1,
            shouldRest: true,
            timeLeft: nextExercise.rest,
            isTimerRunning: true
          };
        } else {
          return {
            newExerciseIndex: currentExerciseIndex,
            newSet: currentSet,
            shouldRest: false,
            timeLeft: 0,
            isTimerRunning: false
          };
        }
      }
    }
  }
  return null;
};

/**
 * Handle normal (non-superset) exercise progression
 * @param {Object} params - Progression parameters
 * @param {number} currentExerciseIndex - Current exercise index
 * @param {number} currentSet - Current set number
 * @param {number} totalExercises - Total number of exercises
 * @param {number} exerciseSets - Number of sets for current exercise
 * @param {number} restTime - Rest time for current exercise
 * @param {boolean} fromRest - Whether this is called from rest state
 * @returns {Object} - Updated state values
 */
export const handleNormalProgression = ({
  currentExerciseIndex,
  currentSet,
  totalExercises,
  exerciseSets,
  restTime
}) => {
  if (currentSet < exerciseSets) {
    return {
      newExerciseIndex: currentExerciseIndex,
      newSet: currentSet + 1,
      shouldRest: true,
      timeLeft: restTime,
      isTimerRunning: true
    };
  } else {
    if (currentExerciseIndex < totalExercises - 1) {
      return {
        newExerciseIndex: currentExerciseIndex + 1,
        newSet: 1,
        shouldRest: false,
        timeLeft: 0,
        isTimerRunning: false
      };
    } else {
      return {
        newExerciseIndex: currentExerciseIndex,
        newSet: currentSet,
        shouldRest: false,
        timeLeft: 0,
        isTimerRunning: false
      };
    }
  }
};

/**
 * Format time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
export const formatTime = (seconds) => {
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;
  return `${isNegative ? '+' : ''}${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Validate workout data structure
 * @param {Object} workout - Workout object to validate
 * @throws {Error} - If workout data is invalid
 */
export const validateWorkoutData = (workout) => {
  if (!workout || typeof workout !== 'object') {
    throw new Error('Workout must be an object');
  }

  const requiredProperties = ['name', 'color', 'description', 'exercises'];
  for (const prop of requiredProperties) {
    if (!workout[prop]) {
      throw new Error(`Workout missing required property: ${prop}`);
    }
  }

  if (!Array.isArray(workout.exercises) || workout.exercises.length === 0) {
    throw new Error('Workout must have at least one exercise');
  }

    workout.exercises.forEach((exercise, index) => {
      const exerciseRequiredProps = ['name', 'sets', 'reps', 'rest', 'group'];
      for (const prop of exerciseRequiredProps) {
        if (!(prop in exercise)) {
          throw new Error(`Exercise ${index + 1} missing required property: ${prop}`);
        }
      }

    if (!Number.isInteger(exercise.sets) || exercise.sets <= 0) {
      throw new Error(`Exercise ${index + 1} must have positive integer sets`);
    }

    // Allow 0 rest for first exercise in supersets (group ends with '1')
    // but require 30-180 for other exercises
    const isFirstInSuperset = exercise.group.includes('1');
    if (!isFirstInSuperset && (exercise.rest < 30 || exercise.rest > 180)) {
      throw new Error(`Exercise ${index + 1} rest time must be between 30-180 seconds`);
    }
    if (isFirstInSuperset && exercise.rest < 0) {
      throw new Error(`Exercise ${index + 1} rest time cannot be negative`);
    }
  });

  // Validate superset pairs have matching sets
  const supersetGroups = {};
  workout.exercises.forEach((exercise, index) => {
    const group = exercise.group;
    if (group.includes('1') || group.includes('2')) {
      const baseGroup = group.replace(/[12]/, '');
      if (!supersetGroups[baseGroup]) {
        supersetGroups[baseGroup] = [];
      }
      supersetGroups[baseGroup].push({
        index: index,
        name: exercise.name,
        sets: exercise.sets,
        group: exercise.group
      });
    }
  });

  for (const [baseGroup, exercises] of Object.entries(supersetGroups)) {
    if (exercises.length === 2) {
      const exercise1 = exercises.find(e => e.group.includes('1'));
      const exercise2 = exercises.find(e => e.group.includes('2'));

      if (exercise1.sets !== exercise2.sets) {
        throw new Error(`Superset pair ${baseGroup}1 (${exercise1.name}) and ${baseGroup}2 (${exercise2.name}) must have the same number of sets. Found ${exercise1.sets} and ${exercise2.sets} respectively.`);
      }
    }
  }
};
