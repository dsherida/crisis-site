import React from 'react';
import {Route, Switch} from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import Players from './pages/Players';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Players} />
      <Route path="/players" component={Players} />
      <Route path="/login-register" component={LoginRegister} />
    </Switch>
  </main>
);

export default Main;
