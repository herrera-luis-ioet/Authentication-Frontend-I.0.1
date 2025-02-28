# Authentication Frontend

This is the frontend component of the Authentication System, built with React and Material UI.

## Technologies Used

- React 18
- Material UI 5
- React Router 6
- JWT Authentication

## Project Structure

```
src/
  ├── components/     # React components
  │   └── auth/      # Authentication-related components
  ├── services/      # API and service layer
  ├── contexts/      # React context providers
  └── utils/         # Utility functions and helpers
```

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Authentication Flow

The application uses JWT (JSON Web Tokens) for authentication. The authentication flow includes:

- User registration
- User login
- Token management
- Protected routes

## Contributing

Please read the contributing guidelines before submitting any changes.