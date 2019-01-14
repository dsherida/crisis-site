import {action, observable} from 'mobx';
import {IUser} from '../models/User';
import {RootStore} from './index';

class UserStore {
  rootStore: RootStore;

  @observable
  users: IUser[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  setUsers = (users: IUser[]) => {
    this.users = users;
  };
}

export type UserStoreProps = {userStore?: UserStore};
export default UserStore;
