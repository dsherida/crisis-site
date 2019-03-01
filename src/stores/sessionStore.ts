import axios from 'axios';
import {User} from 'firebase';
import {action, observable, runInAction} from 'mobx';
import {ReactStripeElements} from 'react-stripe-elements';
import CrisisApi from '../CrisisApi';
import {db} from '../firebase';
import {ExifOrientation, IUser} from '../models/User';
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

  @observable
  membershipStatusLoading: boolean = false;

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
  setMembershipStatusLoadingTimeout = (timeout: number = 10000) => {
    this.membershipStatusLoading = true;
    setTimeout(() => {
      runInAction(() => {
        this.membershipStatusLoading = false;
      });
    }, timeout);
  };

  @action
  setPlayerImageOrientation = (avatarOrientation: ExifOrientation) => {
    this.firebaseUser.avatarOrientation = avatarOrientation;

    db.updateFirebaseUser(this.authUser.uid, {avatarOrientation}, error => {
      if (error) {
        console.error('Error while trying to write avatarOrientation to Firebase User');
      } else {
        console.log('Successfully saved the avatarOrientation to Firebase User.');
      }
    });
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
      updateCustomerCardResponse = await CrisisApi.updateCustomerCard(this.firebaseUser.stripeUid, stripeToken);

      console.log('updateCustomerCardResponse: ' + JSON.stringify(updateCustomerCardResponse));

      return Promise.resolve(updateCustomerCardResponse);
    } catch (err) {
      console.error('An error occurred while attempting to update the Customer Token on Stripe');
      return Promise.reject(err.message);
    }
  };

  @action
  cancelSubscription = async (): Promise<any | Error> => {
    this.setMembershipStatusLoadingTimeout();

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

      runInAction(() => (this.membershipStatusLoading = false));
      return Promise.resolve(cancelSubscriptionResponse);
    } catch (err) {
      this.membershipStatusLoading = false;
      return Promise.reject(err.message);
    }
  };

  @action
  resumeSubscription = async (): Promise<any | Error> => {
    this.setMembershipStatusLoadingTimeout();

    try {
      const resumeSubscriptionResponse = await CrisisApi.resumeSubscription(this.firebaseUser.subscriptionId);

      const {cancel_at_period_end} = resumeSubscriptionResponse.data.response;

      if (cancel_at_period_end) {
        return Promise.reject('Failed to resume membership. Stripe cancel_at_period_end was TRUE, expected to be FALSE.');
      }

      this.setFirebaseUser({...this.firebaseUser, canceledAt: null});

      db.updateFirebaseUser(this.authUser.uid, {canceledAt: null}, error => {
        if (error) {
          console.error('Error while trying to write canceledAt value to Firebase User');
          return Promise.reject(error.message);
        } else {
          console.log('Successfully saved the canceledAt value to Firebase User.');
        }
      });

      runInAction(() => (this.membershipStatusLoading = false));
      return Promise.resolve(resumeSubscriptionResponse);
    } catch (err) {
      this.membershipStatusLoading = false;
      return Promise.reject(err.message);
    }
  };
}

export type SessionStoreProps = {sessionStore?: SessionStore};
export default SessionStore;
export const SessionStoreName = 'sessionStore';
