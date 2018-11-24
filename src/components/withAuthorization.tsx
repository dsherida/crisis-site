import * as React from 'react';
import {withRouter} from 'react-router';
import {LOGIN_REGISTER} from '../constants/routes';
import {firebase} from '../firebase';
import AuthUserContext from './AuthUserContext';

const withAuthorization = (authCondition: (authUser: any) => boolean) => (Component: React.ComponentType<any>) => {
  class WithAuthorization extends React.Component<any> {
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!authCondition(authUser)) {
          this.props.history.push(LOGIN_REGISTER);
        }
      });
    }

    render() {
      return <AuthUserContext.Consumer>{authUser => (authUser ? <Component {...this.props} /> : null)}</AuthUserContext.Consumer>;
    }
  }

  return withRouter(WithAuthorization);
};

export default withAuthorization;
