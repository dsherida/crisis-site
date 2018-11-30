import {User} from 'firebase';
import {action, observable} from 'mobx';
import {RootStore} from './index';

class UserStore {
  rootStore: RootStore;

  @observable
  users: User[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  setUsers = (users: User[]) => {
    this.users = users;
  };
}

export type UserStoreProps = {userStore?: UserStore};
export default UserStore;
