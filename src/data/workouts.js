/**
 * Workout data separated from the main component for better maintainability
 */
export const workouts = {
  workoutAlpha: {
    name: 'Alpha',
    color: 'blue',
    description: 'Vertical Push/Pull Focus',
    exercises: [
      { name: 'Overhead Press', sets: 4, reps: '6-8', rest: 0, group: 'A1' },
      { name: 'Chin-ups', sets: 4, reps: '6-10', rest: 120, group: 'A2' },
      { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest: 90, group: 'B' },
      { name: 'DB Row', sets: 3, reps: '10-12', rest: 0, group: 'C1' },
      { name: 'DB Hammer Curl', sets: 3, reps: '10-12', rest: 90, group: 'C2' },
      { name: 'Hanging Leg Raise', sets: 3, reps: '8-12', rest: 60, group: 'D' },
    ]
  },
  workoutBeta: {
    name: 'Beta',
    color: 'orange',
    description: 'Horizontal Push/Pull Focus',
    exercises: [
      { name: 'DB Row', sets: 4, reps: '6-8', rest: 0, group: 'A1' },
      { name: 'Slight Incline DB Bench Press', sets: 4, reps: '6-10', rest: 120, group: 'A2' },
      { name: 'Close Grip Bench Press', sets: 3, reps: '8-10', rest: 0, group: 'B1' },
      { name: 'DB Face Pulls', sets: 3, reps: '12-15', rest: 90, group: 'B2' },
      { name: 'Hyperextensions', sets: 3, reps: '10-12', rest: 60, group: 'C' },
      { name: 'Exercise Ball Crunch', sets: 3, reps: '8-12', rest: 60, group: 'D' },
    ]
  },
  workoutGamma: {
    name: 'Gamma',
    color: 'green',
    description: 'Quad Dominant Leg Day',
    exercises: [
      { name: 'Weighted Vest Squat', sets: 4, reps: '8-10', rest: 0, group: 'A1' },
      { name: 'DB Step-ups (Weighted Vest)', sets: 4, reps: '8-10', rest: 120, group: 'A2' },
      { name: 'Leg Extension', sets: 4, reps: '12-15', rest: 0, group: 'B1' },
      { name: 'DB Bulgarian Split Squat', sets: 4, reps: '8-10', rest: 90, group: 'B2' },
      { name: 'Leg Curl', sets: 3, reps: '12-15', rest: 0, group: 'C1' },
      { name: 'Front Squat', sets: 3, reps: '8-12', rest: 90, group: 'C2' },
      { name: 'Hanging Knee Raises', sets: 3, reps: '12-15', rest: 60, group: 'D' },
    ]
  },
  workoutDelta: {
    name: 'Delta',
    color: 'purple',
    description: 'Delt & Arm Specialization',
    exercises: [
      { name: 'DB Shoulder Press', sets: 4, reps: '8-10', rest: 0, group: 'A1' },
      { name: 'Arnold Press', sets: 4, reps: '10-12', rest: 90, group: 'A2' },
      { name: 'Lateral Raises', sets: 4, reps: '12-15', rest: 0, group: 'B1' },
      { name: 'Rear Delt Fly', sets: 4, reps: '12-15', rest: 90, group: 'B2' },
      { name: 'DB Bicep Curl', sets: 3, reps: '10-12', rest: 0, group: 'C1' },
      { name: 'DB Overhead Triceps Extension', sets: 3, reps: '12-15', rest: 90, group: 'C2' },
      { name: 'DB Hammer Curl', sets: 3, reps: '10-12', rest: 0, group: 'D1' },
      { name: 'DB Triceps Kickback', sets: 3, reps: '12-15', rest: 90, group: 'D2' },
    ]
  },
  workoutEpsilon: {
    name: 'Epsilon',
    color: 'red',
    description: 'Upper Body Balance Day',
    exercises: [
      { name: 'Slight Incline DB Bench Press', sets: 3, reps: '8-10', rest: 0, group: 'A1' },
      { name: 'DB Row', sets: 3, reps: '8-10', rest: 120, group: 'A2' },
      { name: 'Flat DB Bench Press', sets: 3, reps: '8-10', rest: 0, group: 'B1' },
      { name: 'Single-Arm DB Row', sets: 3, reps: '8-10', rest: 120, group: 'B2' },
      { name: 'DB Face Pulls', sets: 3, reps: '12-15', rest: 0, group: 'C1' },
      { name: 'DB Shrugs', sets: 3, reps: '12-15', rest: 90, group: 'C2' },
      { name: 'Plank (Weighted Vest)', sets: 3, reps: '30-45s', rest: 60, group: 'D' },
    ]
  },
  workoutZeta: {
    name: 'Zeta',
    color: 'indigo',
    description: 'Hamstring & Glute Specialization',
    exercises: [
      { name: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: 0, group: 'A1' },
      { name: 'DB Deadlift', sets: 4, reps: '8-10', rest: 150, group: 'A2' },
      { name: 'Leg Curl', sets: 4, reps: '12-15', rest: 0, group: 'B1' },
      { name: 'Hip Thrust (Weighted Vest)', sets: 4, reps: '10-12', rest: 120, group: 'B2' },
      { name: 'Calf Raises (Weighted Vest)', sets: 4, reps: '15-20', rest: 0, group: 'C1' },
      { name: 'Hanging Leg Raise', sets: 4, reps: '12-15', rest: 90, group: 'C2' },
    ]
  }
};
