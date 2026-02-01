/**
 * Progress tracking utilities for storing and retrieving workout history
 * and generating analytics data
 */

const STORAGE_KEYS = {
  WORKOUT_HISTORY: 'workout_history',
  USER_PROFILE: 'user_profile',
  EXERCISE_LOGS: 'exercise_logs'
};

/**
 * Get workout history from localStorage
 * @returns {Array} Array of completed workouts
 */
export const getWorkoutHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading workout history:', error);
    return [];
  }
};

/**
 * Save a completed workout to history
 * @param {Object} workoutData - Workout completion data
 */
export const saveWorkoutToHistory = (workoutData) => {
  try {
    const history = getWorkoutHistory();
    const newEntry = {
      ...workoutData,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      id: Date.now()
    };
    
    history.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving workout history:', error);
  }
};

/**
 * Get exercise logs for tracking progress
 * @returns {Object} Object with exercise logs
 */
export const getExerciseLogs = () => {
  try {
    const logs = localStorage.getItem(STORAGE_KEYS.EXERCISE_LOGS);
    return logs ? JSON.parse(logs) : {};
  } catch (error) {
    console.error('Error loading exercise logs:', error);
    return {};
  }
};

/**
 * Log a completed set for an exercise
 * @param {string} workoutName - Name of the workout
 * @param {string} exerciseName - Name of the exercise
 * @param {number} setNumber - Set number
 * @param {number} weight - Weight used (optional)
 * @param {number} reps - Reps completed
 * @param {string} notes - Additional notes (optional)
 */
export const logExerciseSet = (workoutName, exerciseName, setNumber, weight, reps, notes = '') => {
  try {
    const logs = getExerciseLogs();
    const key = `${workoutName}-${exerciseName}`;
    
    if (!logs[key]) {
      logs[key] = [];
    }
    
    logs[key].push({
      workoutName,
      exerciseName,
      setNumber,
      weight: weight || null,
      reps,
      notes,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    });
    
    localStorage.setItem(STORAGE_KEYS.EXERCISE_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Error logging exercise set:', error);
  }
};

/**
 * Get user profile data
 * @returns {Object} User profile object
 */
export const getUserProfile = () => {
  try {
    const profile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : {
      name: '',
      weight: null,
      height: null,
      experienceLevel: 'beginner',
      goals: [],
      startDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error loading user profile:', error);
    return {
      name: '',
      weight: null,
      height: null,
      experienceLevel: 'beginner',
      goals: [],
      startDate: new Date().toISOString()
    };
  }
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 */
export const updateUserProfile = (updates) => {
  try {
    const profile = getUserProfile();
    const newProfile = { ...profile, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newProfile));
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

/**
 * Get weekly volume summary for a muscle group
 * @param {string} muscleGroup - Muscle group name
 * @param {number} weeksBack - Number of weeks to look back
 * @returns {Object} Volume summary data
 */
export const getWeeklyVolumeSummary = (muscleGroup, weeksBack = 4) => {
  const history = getWorkoutHistory();
  const now = new Date();
  const weeksAgo = new Date(now.getTime() - (weeksBack * 7 * 24 * 60 * 60 * 1000));
  
  const relevantWorkouts = history.filter(workout => 
    new Date(workout.timestamp) >= weeksAgo
  );

  const weeklyData = {};
  
  // Initialize weekly buckets
  for (let i = 0; i < weeksBack; i++) {
    const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
    const weekEnd = new Date(weekStart.getTime() + (6 * 24 * 60 * 60 * 1000));
    weeklyData[i] = {
      week: i + 1,
      dateRange: `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
      volume: 0,
      workouts: 0
    };
  }

  relevantWorkouts.forEach(workout => {
    const workoutDate = new Date(workout.timestamp);
    const weekIndex = Math.floor((now - workoutDate) / (7 * 24 * 60 * 60 * 1000));
    
    if (weekIndex >= 0 && weekIndex < weeksBack) {
      weeklyData[weekIndex].workouts++;
      // Add volume calculation based on workout data
      if (workout.exercises) {
        workout.exercises.forEach(ex => {
          // Simple volume calculation: sets * reps
          weeklyData[weekIndex].volume += (ex.sets || 0) * (ex.reps || 0);
        });
      }
    }
  });

  return Object.values(weeklyData);
};

/**
 * Get exercise performance trends
 * @param {string} exerciseName - Name of the exercise
 * @param {number} daysBack - Number of days to look back
 * @returns {Array} Performance trend data
 */
export const getExerciseTrends = (exerciseName, daysBack = 30) => {
  const logs = getExerciseLogs();
  const key = Object.keys(logs).find(k => k.includes(exerciseName));
  
  if (!key || !logs[key]) {
    return [];
  }

  const now = new Date();
  const daysAgo = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
  
  const relevantLogs = logs[key]
    .filter(log => new Date(log.timestamp) >= daysAgo)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return relevantLogs.map(log => ({
    date: log.date,
    weight: log.weight,
    reps: log.reps,
    volume: (log.weight || 0) * log.reps,
    timestamp: log.timestamp
  }));
};

/**
 * Calculate training frequency
 * @param {number} weeksBack - Number of weeks to analyze
 * @returns {Object} Frequency analysis
 */
export const getTrainingFrequency = (weeksBack = 4) => {
  const history = getWorkoutHistory();
  const now = new Date();
  const weeksAgo = new Date(now.getTime() - (weeksBack * 7 * 24 * 60 * 60 * 1000));
  
  const relevantWorkouts = history.filter(workout => 
    new Date(workout.timestamp) >= weeksAgo
  );

  const frequency = {
    totalWorkouts: relevantWorkouts.length,
    workoutsByType: {},
    averagePerWeek: 0,
    mostFrequentDay: '',
    consistency: 0
  };

  // Count workouts by type
  relevantWorkouts.forEach(workout => {
    const type = workout.workoutType || workout.name;
    frequency.workoutsByType[type] = (frequency.workoutsByType[type] || 0) + 1;
  });

  frequency.averagePerWeek = frequency.totalWorkouts / weeksBack;

  // Find most frequent day of week
  const dayCounts = {};
  relevantWorkouts.forEach(workout => {
    const day = new Date(workout.timestamp).getDay();
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
    dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
  });
  
  const dayKeys = Object.keys(dayCounts);
  frequency.mostFrequentDay = dayKeys.length > 0 
    ? dayKeys.reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b)
    : 'N/A';

  // Calculate consistency (how evenly distributed workouts are)
  const weeklyDistribution = Array(weeksBack).fill(0);
  relevantWorkouts.forEach(workout => {
    const weekIndex = Math.floor((now - new Date(workout.timestamp)) / (7 * 24 * 60 * 60 * 1000));
    if (weekIndex >= 0 && weekIndex < weeksBack) {
      weeklyDistribution[weekIndex]++;
    }
  });

  const stdDev = Math.sqrt(
    weeklyDistribution.reduce((acc, val) => acc + Math.pow(val - frequency.averagePerWeek, 2), 0) / weeksBack
  );
  
  frequency.consistency = frequency.averagePerWeek > 0 ? Math.max(0, 1 - (stdDev / frequency.averagePerWeek)) : 0;

  return frequency;
};

/**
 * Clear all progress data (for testing or fresh start)
 */
export const clearProgressData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.WORKOUT_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.EXERCISE_LOGS);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch (error) {
    console.error('Error clearing progress data:', error);
  }
};