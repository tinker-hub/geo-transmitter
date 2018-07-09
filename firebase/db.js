import { db } from './firebase';

export const transmitLocation = ({ id, location }) => {
  db.ref(`trains/${id}`).set({
    location: location,
  });
};
