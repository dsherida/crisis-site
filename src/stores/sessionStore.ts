import {User} from 'firebase';
import {action, observable} from 'mobx';
import {RootStore} from './index';

class SessionStore {
  rootStore: RootStore = null;

  @observable
  authUser: User = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  setAuthUser = (authUser: User) => {
    this.authUser = authUser;
  };
}

export type SessionStoreProps = {sessionStore?: SessionStore};
export default SessionStore;
export const SessionStoreName = 'sessionStore';
