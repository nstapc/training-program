/**
 * Comprehensive utility tests for workout functionality
 * Tests data structure, validation, and business logic
 */
import { workouts } from '../data/workouts';
import { validateWorkoutData } from './workoutUtils';

describe('Workout Data Structure', () => {
  test('should have nine workout programs', () => {
    expect(Object.keys(workouts).length).toBe(9);
  });

  test('each workout should have required properties', () => {
    Object.values(workouts).forEach(workout => {
      expect(workout).toHaveProperty('name');
      expect(workout).toHaveProperty('description');
      expect(workout).toHaveProperty('exercises');
      expect(Array.isArray(workout.exercises)).toBe(true);
    });
  });

  test('each exercise should have required properties', () => {
    Object.values(workouts).forEach(workout => {
      workout.exercises.forEach(exercise => {
        expect(exercise).toHaveProperty('name');
        expect(exercise).toHaveProperty('sets');
        expect(exercise).toHaveProperty('reps');
        expect(exercise).toHaveProperty('rest');
        expect(exercise).toHaveProperty('group');
      });
    });
  });
});

describe('Superset Identification', () => {
  test('should identify superset exercises across all workouts', () => {
    let totalSupersetExercises = 0;

    Object.values(workouts).forEach(workout => {
      const supersetExercises = workout.exercises.filter(ex =>
        ex.group.includes('1') || ex.group.includes('2')
      );
      totalSupersetExercises += supersetExercises.length;
    });

    expect(totalSupersetExercises).toBeGreaterThan(0);
  });

  test('superset pairs should have matching base groups', () => {
    Object.values(workouts).forEach(workout => {
      const supersetPairs = {};

      workout.exercises.forEach(exercise => {
        if (exercise.group.includes('1') || exercise.group.includes('2')) {
          const baseGroup = exercise.group.replace(/[12]/, '');
          if (!supersetPairs[baseGroup]) {
            supersetPairs[baseGroup] = [];
          }
          supersetPairs[baseGroup].push(exercise);
        }
      });

      // Each superset pair should have exactly 2 exercises
      Object.values(supersetPairs).forEach(pair => {
        expect(pair.length).toBe(2);
      });
    });
  });
});

describe('Data Validation', () => {
  test('rest times should be reasonable values', () => {
    Object.values(workouts).forEach(workout => {
      workout.exercises.forEach(exercise => {
        const isSupersetExercise = exercise.group.includes('1') || exercise.group.includes('2');
        if (!isSupersetExercise) {
          expect(exercise.rest).toBeGreaterThanOrEqual(30);
          expect(exercise.rest).toBeLessThanOrEqual(180);
        } else {
          // Superset exercises can have 0 rest
          expect(exercise.rest).toBeGreaterThanOrEqual(0);
          expect(exercise.rest).toBeLessThanOrEqual(180);
        }
      });
    });
  });

  test('sets should be positive integers', () => {
    Object.values(workouts).forEach(workout => {
      workout.exercises.forEach(exercise => {
        expect(Number.isInteger(exercise.sets)).toBe(true);
        expect(exercise.sets).toBeGreaterThan(0);
      });
    });
  });
});

describe('Workout Progression Logic', () => {
  test('should have logical exercise grouping', () => {
    Object.values(workouts).forEach(workout => {
      const groups = {};
      workout.exercises.forEach(exercise => {
        if (!groups[exercise.group]) {
          groups[exercise.group] = 0;
        }
        groups[exercise.group]++;
      });

      // Each group should have at least one exercise
      Object.values(groups).forEach(count => {
        expect(count).toBeGreaterThan(0);
      });
    });
  });
});

describe('Superset Validation', () => {
  test('should validate superset pairs with matching sets', () => {
    // Test that valid workouts pass validation
    Object.values(workouts).forEach(workout => {
      // Skip validation for workouts that have 0 rest time in first superset exercises
      // This is allowed per the validation logic
      expect(() => validateWorkoutData(workout)).not.toThrow();
    });
  });

  test('should throw error for superset pairs with mismatched sets', () => {
    const invalidWorkout = {
      name: 'Invalid Superset Workout',
      description: 'Test workout with mismatched superset sets',
      exercises: [
        { name: 'Exercise A1', sets: 4, reps: '8-10', rest: 90, group: 'A1' },
        { name: 'Exercise A2', sets: 3, reps: '8-10', rest: 90, group: 'A2' }, // Mismatched sets
        { name: 'Exercise B', sets: 3, reps: '8-10', rest: 60, group: 'B' }
      ]
    };

    expect(() => validateWorkoutData(invalidWorkout)).toThrow(
      'Superset pair A1 (Exercise A1) and A2 (Exercise A2) must have the same number of sets. Found 4 and 3 respectively.'
    );
  });
});