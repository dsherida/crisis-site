import React from 'react';
import {Route, Switch} from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import Players from './pages/Players';

export const RouteNames = {
  Home: '/',
  Players: '/players',
  LoginRegister: '/login-register',
};

const Main = () => (
  <main>
    <Switch>
      <Route exact path={RouteNames.Home} component={Players} />
      <Route path={RouteNames.Players} component={Players} />
      <Route path={RouteNames.LoginRegister} component={LoginRegister} />
    </Switch>
  </main>
);

export default Main;
