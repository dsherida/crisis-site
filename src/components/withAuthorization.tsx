import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Fragment} from 'react';
import {ReactNode} from 'react';
import {ComponentClass} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {compose} from 'recompose';
import {LOGIN_REGISTER} from '../constants/routes';
import {firebase} from '../firebase';
import {SessionStoreName, SessionStoreProps} from '../stores/sessionStore';

interface Props extends RouteComponentProps, SessionStoreProps {
  children?: ReactNode[] | ReactNode | undefined;
}

const withAuthorization = (authCondition: (authUser: any) => boolean) => (Component: React.ComponentType) => {
  class WithAuthorization extends React.Component<Props> {
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!authCondition(authUser)) {
          this.props.history.push(LOGIN_REGISTER);
        }
      });
    }

    render() {
      const {authUser} = this.props.sessionStore;

      return <Fragment>{authUser ? <Component {...this.props} /> : null}</Fragment>;
    }
  }

  return compose(
    withRouter,
    inject(SessionStoreName),
    observer
  )(WithAuthorization as ComponentClass<any>);
};

export default withAuthorization;
