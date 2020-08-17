import React from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';

import LoginPage from './pages/Login';
import HomePage from './pages/Home';

export default () => {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/login" exact component={LoginPage} />
        </Switch>
      </HashRouter>
    </div>
  );
};
