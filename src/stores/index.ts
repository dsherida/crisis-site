import {configure} from 'mobx';

import SessionStore from './sessionStore';
import UserStore from './userStore';

configure({enforceActions: true});

export class RootStore {
  sessionStore: SessionStore;
  userStore: UserStore;

  constructor() {
    this.sessionStore = new SessionStore(this);
    this.userStore = new UserStore(this);
  }
}

const rootStore = new RootStore();

export default rootStore;
