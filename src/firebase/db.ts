import {IUser} from '../models/User';
import {db} from './firebase';

// User API
export const doCreateUser = (id: string, user: IUser) =>
  db.ref(`users/${id}`).set({
    id,
    first: user.first,
    last: user.last,
    email: user.email,
    phone: user.phone,
  });

export const onceGetUsers = () => db.ref('users').once('value');

export const getFirebaseUser = (id: string, callback: (a: firebase.database.DataSnapshot | null, b?: string) => any) =>
  db
    .ref('users')
    .orderByChild('id')
    .equalTo(id)
    .limitToFirst(1)
    .on('child_added', callback);

export const updateFirebaseUser = (id: string, value: IUser, callback: (a: Error | null) => any) =>
  db
    .ref('users')
    .child(id)
    .update(value, callback);
