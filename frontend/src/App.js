import React from 'react';
import ApplicationDetail from './pages/ApplicationDetail';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitApplication from './pages/SubmitApplication';
import MyApplications from './pages/MyApplications';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplications from './pages/AdminApplications';

const App = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/application/:id" element={<ApplicationDetail />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  if (user.role === 'admin') {
    return (
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/admin/application/:id" element={<ApplicationDetail />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-application" element={<SubmitApplication />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;