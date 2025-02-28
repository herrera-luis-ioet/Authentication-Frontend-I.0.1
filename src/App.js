import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import './App.css';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            {/* Add routes here */}
            <Route path="/" element={<div>Welcome to Authentication System</div>} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;