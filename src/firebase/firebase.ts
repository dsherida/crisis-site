import firebase from 'firebase/app';
import 'firebase/auth';

const devConfig = {
  apiKey: 'AIzaSyCU59uBQaaxeCPVAbc-Vnhlzh_rlJ7jcHk',
  authDomain: 'crisis-site.firebaseapp.com',
  databaseURL: 'https://crisis-site.firebaseio.com',
  projectId: 'crisis-site',
  storageBucket: 'crisis-site.appspot.com',
  messagingSenderId: '1069457975137',
};

const prodConfig = {
  apiKey: 'AIzaSyB4mi7cFWG_KrV4XcLG2yKKmJ6J2I5742I',
  authDomain: 'crisis-site-prod.firebaseapp.com',
  databaseURL: 'https://crisis-site-prod.firebaseio.com',
  projectId: 'crisis-site-prod',
  storageBucket: 'crisis-site-prod.appspot.com',
  messagingSenderId: '29531137490',
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

export {auth};