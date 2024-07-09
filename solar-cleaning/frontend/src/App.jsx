import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import BookingsPage from './components/BookingsPage';
import LogoutPage from './components/LogoutPage';
import WorkersPage from './components/WorkersPage';
import Booking from './components/Booking';
import Worker from './components/Worker';
import Client from './components/Client';
// import ReportsPage from './components/ReportsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/bookings" element={<Booking />} />
        <Route path="/workers" element={<Worker />} />
        <Route path="/clients" element={<Client />} />
        {/* <Route path="/reports" element={<ReportsPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />

      </Routes>
    </Router>
  );
};

export default App;
