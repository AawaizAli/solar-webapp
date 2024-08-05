import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import LogoutPage from './components/LogoutPage';
import Booking from './components/Booking';
import Worker from './components/Worker';
import Client from './components/Client';
import SearchPage from './components/SearchPage';
import ReportsPage from './components/ReportsPage';
import Reports2 from './components/Reports2';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/bookings" element={<Booking />} />
        <Route path="/workers" element={<Worker />} />
        <Route path="/clients" element={<Client />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/reports" element={<ReportsPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </Router>
  );
};

export default App;
