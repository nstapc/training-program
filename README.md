# Training Program - React + Vite

This is a comprehensive training program built with React and Vite, designed to help developers learn modern web development techniques.

## Features

- **React 18+** with modern hooks and components
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **ESLint** for code quality and consistency
- **PostCSS** for advanced CSS processing
- **Responsive Design** ready

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nstapc/training-program.git
cd training-program
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
training-program/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images and static files
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   └── App.css              # Component-specific styles
├── .gitignore               # Git ignore rules
├── eslint.config.js         # ESLint configuration
├── package.json             # Project dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite configuration
└── README.md                # Project documentation
```

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Create production build
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Development

### Adding New Components

1. Create a new component file in the `src/` directory (e.g., `src/components/Button.jsx`)
2. Import and use it in your main application

### Styling

This project uses Tailwind CSS for styling. You can:
- Use utility classes directly in your JSX
- Add custom styles in the component CSS files
- Configure Tailwind in `tailwind.config.js`

### Code Quality

ESLint is configured to enforce code quality standards. Run `npm run lint` to check your code before committing.

## Deployment

To deploy this application:

1. Build for production:
```bash
npm run build
```

2. Deploy the contents of the `dist/` directory to your hosting provider.

## Learning Resources

- [React Documentation](https://react.dev/learn)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ESLint Documentation](https://eslint.org/docs/latest/)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.