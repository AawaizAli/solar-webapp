import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
// import BookingsPage from './components/BookingsPage';
// import WorkersPage from './components/WorkersPage';
// import ReportsPage from './components/ReportsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        {/* <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/workers" element={<WorkersPage />} />
        <Route path="/reports" element={<ReportsPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
};

export default App;
