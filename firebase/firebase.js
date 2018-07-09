import firebase from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyAzeAOTIvV4BpjeHQZSiFAsMStpMZN6pBE',
  authDomain: 'sandbox-9c4c2.firebaseapp.com',
  databaseURL: 'https://sandbox-9c4c2.firebaseio.com',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();

export { db };
