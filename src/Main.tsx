import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Header from './components/Header';
import withAuthentication from './components/withAuthentication';
import {HOME, LOGIN_REGISTER, PLAYERS, PROFILE} from './constants/routes';
import LoginRegister from './pages/LoginRegister';
import Players from './pages/Players';
import Profile from './pages/Profile';

const Main = () => (
  <main>
    <Header />
    <Switch>
      <Route exact path={HOME} component={Players} />
      <Route exact path={PLAYERS} component={Players} />
      <Route exact path={LOGIN_REGISTER} component={LoginRegister} />
      <Route exact path={PROFILE} component={Profile} />
    </Switch>
  </main>
);

export default withAuthentication(Main);
