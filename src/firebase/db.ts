import {IUser} from '../models/User';
import {db} from './firebase';

// User API
export const doCreateUser = (id: string, user: IUser) =>
  db.ref(`users/${id}`).set({
    first: user.first,
    last: user.last,
    email: user.email,
    phone: user.phone,
  });

export const onceGetUsers = () => db.ref('users').once('value');
