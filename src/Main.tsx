import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {HOME, LOGIN_REGISTER, PLAYERS} from './constants/routes';
import LoginRegister from './pages/LoginRegister';
import Players from './pages/Players';

const Main = () => (
  <main>
    <Switch>
      <Route exact path={HOME} component={Players} />
      <Route exact path={PLAYERS} component={Players} />
      <Route exact path={LOGIN_REGISTER} component={LoginRegister} />
    </Switch>
  </main>
);

export default Main;
