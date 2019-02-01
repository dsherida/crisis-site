import axios from 'axios';
import {User} from 'firebase';
import {action, observable} from 'mobx';
import {ReactStripeElements} from 'react-stripe-elements';
import CrisisApi from '../CrisisApi';
import {db} from '../firebase';
import {IUser} from '../models/User';
import StripeProps = ReactStripeElements.StripeProps;
import PatchedTokenResponse = ReactStripeElements.PatchedTokenResponse;
import DataModelUtils from '../utils/DataModelUtils';
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

  @action
  updateCustomerStripeToken = async (stripe: StripeProps): Promise<any | Error> => {
    // Generate new Stripe Token
    let createTokenResponse;
    try {
      createTokenResponse = await stripe.createToken({
        name: `${this.firebaseUser.first} ${this.firebaseUser.last}`,
        currency: 'usd',
      });
      console.log('createTokenResponse: ' + JSON.stringify(createTokenResponse, null, 2));
    } catch (err) {
      console.log('An error occurred while attempting to create a Stripe Token. Error: ' + err.message);
      return Promise.reject(err.message);
    }

    if (createTokenResponse.error) {
      console.error('Something went wrong creating a new Token. Error: ' + createTokenResponse.error.message);
      return Promise.reject(createTokenResponse.error.message);
    }

    const stripeToken = createTokenResponse.token.id;
    const card = DataModelUtils.stripeCardToCrisisApi(createTokenResponse.token.card);

    const updatedFirebaseUser = {...this.firebaseUser, stripeToken, card};

    // Update MobX Firebase User with new Stripe Token and Card
    this.setFirebaseUser(updatedFirebaseUser);

    // Update the Firebase Database User with Stripe Token and Card
    db.updateFirebaseUser(this.authUser.uid, {stripeToken, card}, error => {
      if (error) {
        console.error('Error while trying to write Stripe Token and Card to Firebase User');
        return Promise.reject(error.message);
      } else {
        console.log('Successfully saved the Token and Card to Firebase User.');
      }
    });

    // Update the Stripe Customer Token
    let updateCustomerCardResponse: any;
    try {
      updateCustomerCardResponse = await axios.post(`https://us-central1-crisis-site.cloudfunctions.net/updateCustomerCard`, {
        customerId: this.firebaseUser.stripeUid,
        token: stripeToken,
      });

      console.log('updateCustomerCardResponse: ' + JSON.stringify(updateCustomerCardResponse));

      return Promise.resolve(updateCustomerCardResponse);
    } catch (err) {
      console.error('An error occurred while attempting to update the Customer Token on Stripe');
      return Promise.reject(err.message);
    }
  };

  @action
  cancelSubscription = async (): Promise<any | Error> => {
    try {
      const cancelSubscriptionResponse = await CrisisApi.cancelSubscription(this.firebaseUser.subscriptionId);

      console.log('cancelSubscriptionResponse: ' + JSON.stringify(cancelSubscriptionResponse));

      const canceledAt = cancelSubscriptionResponse.data.response.canceled_at;

      this.setFirebaseUser({...this.firebaseUser, canceledAt});

      db.updateFirebaseUser(this.authUser.uid, {canceledAt}, error => {
        if (error) {
          console.error('Error while trying to write Canceled At value to Firebase User');
          return Promise.reject(error.message);
        } else {
          console.log('Successfully saved the Canceled At value to Firebase User.');
        }
      });

      return Promise.resolve(cancelSubscriptionResponse);
    } catch (err) {
      return Promise.reject(err.message);
    }
  };
}

export type SessionStoreProps = {sessionStore?: SessionStore};
export default SessionStore;
export const SessionStoreName = 'sessionStore';
