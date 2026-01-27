# Training Program - Workout Tracker

A comprehensive workout tracking application built with React, Tailwind CSS, and modern JavaScript best practices.

![Workout Tracker Landing Page](landing.png)

## Features

- **Multiple Workout Programs**: Choose from 6 different workout programs (Alpha, Beta, Gamma, Delta, Epsilon, Zeta)
- **Superset Support**: Intelligent handling of superset exercises with automatic navigation
- **Progress Tracking**: Visual progress indicators for completed sets and exercises
- **Timer Functionality**: Built-in rest timer with overtime tracking
- **Responsive Design**: Works on mobile and desktop devices
- **Accessible UI**: Full keyboard navigation and ARIA support
## Installation

```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the Vite development server at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Testing

Run the comprehensive test suite:
```bash
npm test
```

Tests include:
- Data structure validation
- Superset logic verification
- Component rendering and interaction
- Workout progression algorithms

## Code Quality Features

### Architecture
- **Separation of Concerns**: Clear division between data, utilities, components, and main application
- **Utility Functions**: Complex logic extracted to reusable, testable utility functions
- **Component-Based**: Modular React components with well-defined interfaces

### Testing
- **Comprehensive Coverage**: Tests for data validation, business logic, and UI components
- **Jest Testing Framework**: Industry-standard testing with React Testing Library
- **Mock Data**: Realistic test scenarios with complete workout data

### Code Organization
- **Clean State Management**: Logical state organization with proper React hooks usage
- **Error Handling**: Data validation with meaningful error messages
- **Documentation**: JSDoc comments for all utility functions

### Performance
- **Memoization**: Efficient state updates and rendering
- **Code Splitting**: Logical separation of concerns for better maintainability
- **Optimized Re-renders**: Minimal unnecessary component updates

## Usage

1. **Select a Workout**: Choose from the available workout programs on the main screen
2. **Follow the Program**: The app will guide you through each exercise and set
3. **Track Progress**: Completed sets are marked automatically
4. **Rest Timer**: Automatic rest periods between sets with visual countdown
5. **Navigation**: Skip between exercises and sets as needed

## Workout Data Structure

Each workout follows this structure:
```javascript
{
  name: 'Workout Name',
  color: 'theme-color', // blue, orange, green, purple, red, indigo
  description: 'Workout focus description',
  exercises: [
    {
      name: 'Exercise Name',
      sets: 3-4, // Number of sets
      reps: 'rep-range', // e.g., '8-10'
      rest: 30-180, // Rest time in seconds
      group: 'A1' // Exercise group (superset support)
    }
  ]
}
```

## Technical Stack

- **Frontend**: React 19 with JSX
- **Styling**: Tailwind CSS with responsive design
- **Icons**: Lucide React icon library
- **Testing**: Jest with React Testing Library
- **Linting**: ESLint with React-specific rules
- **Bundler**: Vite for fast development and production builds

## Development Guidelines

1. **Component Testing**: Add tests for any new components
2. **Utility Functions**: Place reusable logic in `src/utils/`
3. **Data Validation**: Use the provided validation utilities
4. **Accessibility**: Maintain ARIA attributes and keyboard navigation
5. **Documentation**: Add JSDoc comments for new functions

## Contributing

Contributions are welcome! Please follow the existing code patterns and maintain test coverage for any new features.

## License

MIT License