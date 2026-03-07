import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import WorkoutsPage from './WorkoutsPage';
import { workouts } from '../data/workouts';
import { validateWorkoutData } from '../utils/workoutUtils';
import { logExerciseSet } from '../utils/progressTracker';
import { playLyreSound } from '../utils/audioUtils';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('../utils/workoutUtils', () => ({
  validateWorkoutData: jest.fn(),
  handleNormalProgression: jest.fn()
}));

jest.mock('../utils/progressTracker', () => ({
  logExerciseSet: jest.fn()
}));

jest.mock('../utils/audioUtils', () => ({
  playLyreSound: jest.fn()
}));

const mockNavigate = jest.fn();

describe('WorkoutsPage Component', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    validateWorkoutData.mockImplementation(() => {}); // No error by default
  });

  test('renders workout selection page when no workout is selected', () => {
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout={null} />);

    expect(screen.getByText('Select a workout')).toBeInTheDocument();
    expect(screen.getByText('Push 1')).toBeInTheDocument();
    expect(screen.getByText('Pull 1')).toBeInTheDocument();
    expect(screen.getByText('Legs 1')).toBeInTheDocument();
  });

  test('handles back button click', () => {
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout={null} />);

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  test('selects workout and navigates to specific URL', () => {
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout={null} />);

    const pushWorkoutButton = screen.getByText('Push 1').closest('button');
    fireEvent.click(pushWorkoutButton);

    expect(validateWorkoutData).toHaveBeenCalledWith(workouts.push1);
    expect(mockNavigate).toHaveBeenCalledWith('/workouts/push1');
  });

  test('handles workout validation errors', () => {
    validateWorkoutData.mockImplementation(() => {
      throw new Error('Invalid workout data');
    });

    render(<WorkoutsPage onBack={mockOnBack} initialWorkout={null} />);

    const pushWorkoutButton = screen.getByText('Push 1').closest('button');
    fireEvent.click(pushWorkoutButton);

    expect(console.error).toHaveBeenCalledWith('Invalid workout data:', 'Invalid workout data');
  });

  test('displays workout when initialWorkout prop is provided', () => {
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout="push1" />);

    expect(screen.getByText('Push 1')).toBeInTheDocument();
    expect(screen.getByText('Push (Chest/Shoulders/Triceps) - Heavy Focus')).toBeInTheDocument();
  });

  test('displays workout exercises in progress component', () => {
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout="push1" />);

    // Should show exercises from the push1 workout
    expect(screen.getByText('Slight Incline DB Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Incline DB Press')).toBeInTheDocument();
    expect(screen.getByText('DB Overhead Press')).toBeInTheDocument();
  });

  test('handles exercise completion', async () => {
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout="push1" />);

    // Find and click the first exercise
    const firstExercise = screen.getByText('Slight Incline DB Bench Press').closest('div');
    fireEvent.click(firstExercise);

    // Should show current exercise details
    expect(screen.getByText('Set 1 of 4')).toBeInTheDocument();

    // Click complete set button
    const completeButton = screen.getByText('Completed Set 1');
    fireEvent.click(completeButton);

    // Should log the exercise set
    expect(logExerciseSet).toHaveBeenCalledWith(
      'Push 1',
      'Slight Incline DB Bench Press',
      1,
      null,
      8, // Using max rep range
      'Completed set 1'
    );
  });

  test('handles rest period completion', async () => {
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout="push1" />);

    // Complete first set to trigger rest
    const completeButton = screen.getByText('Completed Set 1');
    fireEvent.click(completeButton);

    // Should show rest timer
    expect(screen.getByText('Rest Time')).toBeInTheDocument();

    // Complete rest period
    const completeRestButton = screen.getByText('Completed Set 2');
    fireEvent.click(completeRestButton);

    // Should progress to next set
    expect(screen.getByText('Set 2 of 4')).toBeInTheDocument();
  });

  test('handles navigation back to menu', () => {
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout="push1" />);

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    // Should reset to workout selection
    expect(screen.getByText('Select a workout')).toBeInTheDocument();
  });

  test('handles workout progression through all exercises', () => {
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout="push1" />);

    // Complete all sets of first exercise
    for (let i = 1; i <= 4; i++) {
      const completeButton = screen.getByText(`Completed Set ${i}`);
      fireEvent.click(completeButton);
      
      if (i < 4) {
        // Should show rest timer between sets
        expect(screen.getByText('Rest Time')).toBeInTheDocument();
      }
    }

    // Should move to next exercise
    expect(screen.getByText('Incline DB Press')).toBeInTheDocument();
  });

  test('handles initialWorkout prop changes', () => {
    const { rerender } = render(<WorkoutsPage onBack={mockOnBack} initialWorkout="push1" />);

    expect(screen.getByText('Push 1')).toBeInTheDocument();

    rerender(<WorkoutsPage onBack={mockOnBack} initialWorkout="pull1" />);

    expect(screen.getByText('Pull 1')).toBeInTheDocument();
  });

  test('displays correct exercise information', () => {
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout="push1" />);

    // Check that exercise details are displayed - find the specific exercise elements
    const slightInclineElement = screen.getByText('Slight Incline DB Bench Press').closest('.p-4');
    const inclineElement = screen.getByText('Incline DB Press').closest('.p-4');
    const overheadElement = screen.getByText('DB Overhead Press').closest('.p-4');
    
    expect(slightInclineElement).toHaveTextContent('4 x 6-8');
    expect(slightInclineElement).toHaveTextContent('150s rest');
    expect(inclineElement).toHaveTextContent('3 x 8-10');
    expect(inclineElement).toHaveTextContent('120s rest');
    expect(overheadElement).toHaveTextContent('3 x 8-10');
    expect(overheadElement).toHaveTextContent('120s rest');
  });

  test('handles exercise group labels', () => {
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout="push1" />);

    // Should show exercise group labels
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  test('plays sound when rest timer reaches zero', async () => {
    jest.useFakeTimers();
    
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout="push1" />);

    // Complete first set to start rest timer
    const completeButton = screen.getByText('Completed Set 1');
    fireEvent.click(completeButton);

    // Fast forward timer to simulate rest period ending
    jest.advanceTimersByTime(150000); // 150 seconds

    // Check that the sound function was called (may be called multiple times)
    expect(playLyreSound).toHaveBeenCalled();

    jest.useRealTimers();
  });

  test('handles multiple workout selections', () => {
    render(<WorkoutsPage onBack={mockOnBack} initialWorkout={null} />);

    // Select first workout
    const pushWorkoutButton = screen.getByText('Push 1').closest('button');
    fireEvent.click(pushWorkoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/workouts/push1');

    // Select different workout
    const pullWorkoutButton = screen.getByText('Pull 1').closest('button');
    fireEvent.click(pullWorkoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/workouts/pull1');
  });
});