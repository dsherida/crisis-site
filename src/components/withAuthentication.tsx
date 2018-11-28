import {User} from 'firebase';
import {inject} from 'mobx-react';
import * as React from 'react';
import {ReactNode} from 'react';
import {firebase} from '../firebase';
import {SessionStoreName, SessionStoreProps} from '../stores/sessionStore';

interface Props extends SessionStoreProps {
  children?: ReactNode[] | ReactNode | undefined;
}

const withAuthentication = (Component: React.ComponentType) => {
  class WithAuthentication extends React.Component<Props> {
    componentDidMount() {
      const {sessionStore} = this.props;

      firebase.auth.onAuthStateChanged((authUser: User) => {
        authUser ? sessionStore.setAuthUser(authUser) : sessionStore.setAuthUser(null);
      });
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  return inject(SessionStoreName)(WithAuthentication);
};

export default withAuthentication;
