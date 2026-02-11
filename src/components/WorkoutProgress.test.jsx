import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutProgress from './WorkoutProgress';

describe('WorkoutProgress Component', () => {
  const mockExercises = [
    { name: 'Exercise 1', sets: 3, reps: '8-10', rest: 60, group: 'A1' },
    { name: 'Exercise 2', sets: 3, reps: '8-10', rest: 60, group: 'A2' },
    { name: 'Exercise 3', sets: 4, reps: '10-12', rest: 90, group: 'B' }
  ];

  const mockColors = {
    card: 'bg-slate-800 border-slate-700',
    listActive: 'bg-blue-600',
    listInactive: 'bg-slate-700 hover:bg-slate-600',
    text: 'text-blue-400',
    textLight: 'text-slate-400',
    dotInactive: 'bg-slate-600'
  };

  const mockCompletedSets = {
    'workout-0-1': true,
    'workout-0-2': true,
    'workout-1-1': true
  };

  const mockProps = {
    exercises: mockExercises,
    currentExerciseIndex: 0,
    completedSets: mockCompletedSets,
    colors: mockColors,
    skipToExercise: jest.fn(),
    skipToSet: jest.fn(),
    isSetCompleted: (exerciseIdx, setNum) => !!mockCompletedSets[`workout-${exerciseIdx}-${setNum}`],
    isResting: false,
    timeLeft: 0,
    currentSet: 1,
    completeSet: jest.fn(),
    completeSetFromRest: jest.fn()
  };

  test('renders workout progress component with exercises', () => {
    render(<WorkoutProgress {...mockProps} />);

    expect(screen.getByText('Workout Progress')).toBeInTheDocument();
    expect(screen.getByText('Exercise 1')).toBeInTheDocument();
    expect(screen.getByText('Exercise 2')).toBeInTheDocument();
    expect(screen.getByText('Exercise 3')).toBeInTheDocument();
  });

  test('shows correct exercise information', () => {
    render(<WorkoutProgress {...mockProps} />);

    // Check exercise details are displayed correctly
    const exerciseDetails = screen.getAllByText(/×/);
    expect(exerciseDetails.length).toBe(3); // Should have 3 exercise detail lines
    expect(screen.getByText('4 × 10-12 | 90s rest')).toBeInTheDocument();
  });

  test('highlights current exercise', () => {
    render(<WorkoutProgress {...mockProps} />);

    // First exercise should have active styling
    const firstExercise = screen.getByText('Exercise 1').closest('.p-4');
    expect(firstExercise).toHaveClass('bg-white');
    expect(firstExercise).toHaveClass('transition-all');
    expect(firstExercise).toHaveClass('shadow-3xl');
    expect(firstExercise).toHaveClass('border-yellow-500');
    expect(firstExercise).not.toHaveClass('ring-2');
    expect(firstExercise).not.toHaveClass('ring-black');
    expect(firstExercise).not.toHaveClass('transform');
    expect(firstExercise).not.toHaveClass('hover:scale-105');
  });

  test('non-clickable elements do not have hover background', () => {
    render(<WorkoutProgress {...mockProps} />);

    // The main container should not have hover background
    const container = screen.getByText('Workout Progress').closest('div');
    expect(container).toHaveClass('bg-white/90');
    expect(container).not.toHaveClass('hover:bg-white/100');
  });

  test('shows completed sets correctly', () => {
    render(<WorkoutProgress {...mockProps} />);

    // Check that completed sets are shown as green buttons
    const completedButtons = screen.getAllByTitle(/Go to Set/);
    expect(completedButtons[0]).toHaveClass('bg-green-600'); // Set 1 of Exercise 1
    expect(completedButtons[1]).toHaveClass('bg-green-600'); // Set 2 of Exercise 1
    expect(completedButtons[2]).toHaveClass('bg-white/90'); // Set 3 of Exercise 1 (not completed)
    expect(completedButtons[0]).not.toHaveClass('rounded');
    expect(completedButtons[0]).toHaveClass('border');
  });

  test('calls skipToExercise when exercise is clicked', () => {
    render(<WorkoutProgress {...mockProps} />);

    const exercise2 = screen.getByText('Exercise 2').closest('div');
    fireEvent.click(exercise2);

    expect(mockProps.skipToExercise).toHaveBeenCalledWith(1);
  });

  test('calls skipToSet when set dot is clicked', () => {
    render(<WorkoutProgress {...mockProps} />);

    const setDots = screen.getAllByTitle(/Go to Set/);
    fireEvent.click(setDots[2]); // Click set 3 of exercise 1

    expect(mockProps.skipToSet).toHaveBeenCalledWith(3);
  });

});