import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import BookingsPage from './components/BookingsPage';
import WorkersPage from './components/WorkersPage';
import ReportsPage from './components/ReportsPage';
import LoginPage from './components/LoginPage';

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/bookings" component={BookingsPage} />
      <Route path="/workers" component={WorkersPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/login" component={LoginPage} />
    </Switch>
  );
};

export default App;
