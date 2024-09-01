// src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import TaskPage from './pages/TaskPage';
import './index.css';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      {/* Route for the Dashboard */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />
      {/* Route for the LoginPage */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />
      {/* Route for the RegisterPage */}
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
        }
      />
      {/* Route for the ProfilePage */}
      <Route
        path="/profile"
        element={
          isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />
        }
      />
      {/* Route for the TaskPage */}
      <Route
        path="/tasks"
        element={
          isAuthenticated ? <TaskPage /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
