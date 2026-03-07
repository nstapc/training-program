import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { getWorkoutHistory, saveWorkoutToHistory, logExerciseSet } from '../utils/progressTracker';
import { workouts } from '../data/workouts';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock progress tracker
jest.mock('../utils/progressTracker');

describe('Integration Tests - Complete User Flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    
    // Set up default mocks
    getWorkoutHistory.mockReturnValue([]);
    saveWorkoutToHistory.mockImplementation((workoutData) => {
      const history = getWorkoutHistory();
      history.push({
        ...workoutData,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        id: Date.now()
      });
      mockLocalStorage.setItem('workout_history', JSON.stringify(history));
    });
    
    logExerciseSet.mockImplementation((workoutName, exerciseName, setNumber, weight, reps, notes) => {
      const logs = JSON.parse(mockLocalStorage.getItem('exercise_logs') || '{}');
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
      
      mockLocalStorage.setItem('exercise_logs', JSON.stringify(logs));
    });
  });

  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('Complete workout flow: select workout → complete exercises → view progress', async () => {
    renderWithRouter(<App />);

    // 1. Start on landing page
    expect(screen.getByText('Select a workout')).toBeInTheDocument();

    // 2. Select a workout
    const pushWorkoutButton = screen.getByText('Push 1').closest('button');
    fireEvent.click(pushWorkoutButton);

    // Should navigate to workout page
    expect(screen.getByText('Push 1')).toBeInTheDocument();
    expect(screen.getByText('Push (Chest/Shoulders/Triceps) - Heavy Focus')).toBeInTheDocument();

    // 3. Complete first exercise (Slight Incline DB Bench Press - 4 sets)
    const firstExercise = screen.getByText('Slight Incline DB Bench Press').closest('div');
    fireEvent.click(firstExercise);

    // Complete all 4 sets
    for (let i = 1; i <= 4; i++) {
      const completeButton = screen.getByText(`Completed Set ${i}`);
      fireEvent.click(completeButton);
      
      if (i < 4) {
        // Should show rest timer between sets
        expect(screen.getByText('Rest Time')).toBeInTheDocument();
      }
    }

    // 4. Move to second exercise (Incline DB Press - 3 sets)
    expect(screen.getByText('Incline DB Press')).toBeInTheDocument();
    
    for (let i = 1; i <= 3; i++) {
      const completeButton = screen.getByText(`Completed Set ${i}`);
      fireEvent.click(completeButton);
      
      if (i < 3) {
        expect(screen.getByText('Rest Time')).toBeInTheDocument();
      }
    }

    // 5. Verify progress tracking was called
    expect(logExerciseSet).toHaveBeenCalledWith(
      'Push 1',
      'Slight Incline DB Bench Press',
      1,
      null,
      8,
      'Completed set 1'
    );
    
    expect(logExerciseSet).toHaveBeenCalledWith(
      'Push 1',
      'Incline DB Press',
      1,
      null,
      10,
      'Completed set 1'
    );

    // 6. Navigate to dashboard to view progress
    const dashboardLink = screen.getByText('Dashboard');
    fireEvent.click(dashboardLink);

    // Should show progress dashboard
    expect(screen.getByText('Progress Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Track your fitness journey and performance')).toBeInTheDocument();

    // Should show workout completion in recent workouts
    expect(screen.getByText('Push 1')).toBeInTheDocument();
  });

  test('Workout selection and navigation flow', async () => {
    renderWithRouter(<App />);

    // 1. Start on landing page
    expect(screen.getByText('Select a workout')).toBeInTheDocument();

    // 2. Navigate to workouts category
    const workoutsLink = screen.getByText('Workouts');
    fireEvent.click(workoutsLink);

    // Should show workout categories
    expect(screen.getByText('Push/Pull/Legs')).toBeInTheDocument();
    expect(screen.getByText('Full Body')).toBeInTheDocument();
    expect(screen.getByText('Upper/Lower')).toBeInTheDocument();

    // 3. Navigate to specific workout category
    const pushPullLegsLink = screen.getByText('Push/Pull/Legs');
    fireEvent.click(pushPullLegsLink);

    // Should show push/pull/legs workouts
    expect(screen.getByText('Push 1')).toBeInTheDocument();
    expect(screen.getByText('Pull 1')).toBeInTheDocument();
    expect(screen.getByText('Legs 1')).toBeInTheDocument();

    // 4. Select a specific workout
    const pullWorkoutButton = screen.getByText('Pull 1').closest('button');
    fireEvent.click(pullWorkoutButton);

    // Should navigate to pull workout
    expect(screen.getByText('Pull 1')).toBeInTheDocument();
    expect(screen.getByText('Pull (Back/Biceps/Rear Delts) - Volume Focus')).toBeInTheDocument();
  });

  test('Progress tracking and analytics flow', async () => {
    // Set up mock history with some completed workouts
    const mockHistory = [
      {
        id: 1,
        name: 'Push 1',
        exercises: [
          { name: 'DB Bench Press', sets: 4, reps: '6-8' },
          { name: 'DB Row', sets: 3, reps: '8-10' }
        ],
        date: '2024-01-01',
        timestamp: '2024-01-01T10:00:00Z'
      },
      {
        id: 2,
        name: 'Pull 1',
        exercises: [
          { name: 'Pull-ups', sets: 4, reps: '6-8' },
          { name: 'DB Row', sets: 3, reps: '8-10' }
        ],
        date: '2024-01-03',
        timestamp: '2024-01-03T10:00:00Z'
      }
    ];

    getWorkoutHistory.mockReturnValue(mockHistory);

    renderWithRouter(<App />);

    // Navigate to dashboard
    const dashboardLink = screen.getByText('Dashboard');
    fireEvent.click(dashboardLink);

    // Should show progress dashboard with analytics
    expect(screen.getByText('Progress Dashboard')).toBeInTheDocument();

    // Should show stats based on mock data
    expect(screen.getByText('2')).toBeInTheDocument(); // Total workouts
    expect(screen.getByText('1.0')).toBeInTheDocument(); // Average per week

    // Should show recent workouts
    expect(screen.getByText('Push 1')).toBeInTheDocument();
    expect(screen.getByText('Pull 1')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('2024-01-03')).toBeInTheDocument();
  });

  test('Error handling in workout flow', async () => {
    // Mock validation error
    const originalConsoleError = console.error;
    console.error = jest.fn();

    renderWithRouter(<App />);

    // Try to select a workout (this should work normally)
    const pushWorkoutButton = screen.getByText('Push 1').closest('button');
    fireEvent.click(pushWorkoutButton);

    expect(screen.getByText('Push 1')).toBeInTheDocument();

    // Try to complete an exercise (should work)
    const firstExercise = screen.getByText('Slight Incline DB Bench Press').closest('div');
    fireEvent.click(firstExercise);

    const completeButton = screen.getByText('Completed Set 1');
    fireEvent.click(completeButton);

    // Should not have errors
    expect(console.error).not.toHaveBeenCalled();

    console.error = originalConsoleError;
  });

  test('LocalStorage persistence flow', async () => {
    renderWithRouter(<App />);

    // Complete a workout
    const pushWorkoutButton = screen.getByText('Push 1').closest('button');
    fireEvent.click(pushWorkoutButton);

    const firstExercise = screen.getByText('Slight Incline DB Bench Press').closest('div');
    fireEvent.click(firstExercise);

    const completeButton = screen.getByText('Completed Set 1');
    fireEvent.click(completeButton);

    // Verify localStorage was updated
    const history = JSON.parse(mockLocalStorage.getItem('workout_history') || '[]');
    expect(history).toHaveLength(1);
    expect(history[0].name).toBe('Push 1');

    const logs = JSON.parse(mockLocalStorage.getItem('exercise_logs') || '{}');
    expect(logs['Push 1-Slight Incline DB Bench Press']).toHaveLength(1);
    expect(logs['Push 1-Slight Incline DB Bench Press'][0].setNumber).toBe(1);
  });

  test('Navigation between components', async () => {
    renderWithRouter(<App />);

    // 1. Start on landing page
    expect(screen.getByText('Select a workout')).toBeInTheDocument();

    // 2. Navigate to workouts
    const workoutsLink = screen.getByText('Workouts');
    fireEvent.click(workoutsLink);

    expect(screen.getByText('Push/Pull/Legs')).toBeInTheDocument();

    // 3. Navigate to dashboard
    const dashboardLink = screen.getByText('Dashboard');
    fireEvent.click(dashboardLink);

    expect(screen.getByText('Progress Dashboard')).toBeInTheDocument();

    // 4. Navigate to nutrition
    const nutritionLink = screen.getByText('Nutrition');
    fireEvent.click(nutritionLink);

    expect(screen.getByText('Nutrition')).toBeInTheDocument();

    // 5. Navigate back to landing
    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);

    expect(screen.getByText('Select a workout')).toBeInTheDocument();
  });
});