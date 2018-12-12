import {IUser} from '../models/User';
import {auth} from './firebase';

// Sign Up
export const doCreateUserWithEmailAndPassword = (user: IUser) => auth.createUserWithEmailAndPassword(user.email, user.password);
// Sign In
export const doSignInWithEmailAndPassword = (email: string, password: string) => auth.signInWithEmailAndPassword(email, password);
// Sign out
export const doSignOut = () => auth.signOut();
// Password Reset
export const doPasswordReset = (email: string) => auth.sendPasswordResetEmail(email);
// Password Change
export const doPasswordUpdate = (password: string) => auth.currentUser.updatePassword(password);

