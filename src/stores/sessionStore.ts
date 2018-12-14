import {User} from 'firebase';
import {action, observable} from 'mobx';
import {IUser} from '../models/User';
import {RootStore} from './index';

class SessionStore {
  rootStore: RootStore = null;

  @observable
  authUser: User = null;

  @observable
  firebaseUser: IUser = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  setAuthUser = (authUser: User) => {
    this.authUser = authUser;
  };

  @action
  setFirebaseUser = (user: IUser) => {
    this.firebaseUser = user;
  };

  @action
  clearSession = () => {
    this.authUser = null;
    this.firebaseUser = null;
  };
}

export type SessionStoreProps = {sessionStore?: SessionStore};
export default SessionStore;
export const SessionStoreName = 'sessionStore';
