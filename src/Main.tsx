import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {StripeProvider} from 'react-stripe-elements';
import Header from './components/Header';
import withAuthentication from './components/withAuthentication';
import {Config} from './Config';
import {HOME, LOGIN_REGISTER, PLAYERS, PROFILE} from './constants/routes';
import LoginRegister from './pages/LoginRegister';
import Players from './pages/Players';
import Profile from './pages/Profile';

const Main = () => (
  <StripeProvider apiKey={Config.stripeKey}>
    <main>
      <Header />
      <Switch>
        <Route exact path={HOME} component={Players} />
        <Route exact path={PLAYERS} component={Players} />
        <Route exact path={LOGIN_REGISTER} component={LoginRegister} />
        <Route exact path={PROFILE} component={Profile} />
      </Switch>
    </main>
  </StripeProvider>
);

export default withAuthentication(Main);
