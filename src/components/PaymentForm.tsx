import axios from 'axios';
import {inject} from 'mobx-react';
import * as React from 'react';
import {ChangeEvent, ComponentClass} from 'react';
import {CardElement, Elements, injectStripe, ReactStripeElements} from 'react-stripe-elements';
import {compose} from 'recompose';
import {db} from '../firebase';
import {SessionStoreName, SessionStoreProps} from '../stores/sessionStore';
import InjectedStripeProps = ReactStripeElements.InjectedStripeProps;

interface Props extends InjectedStripeProps, SessionStoreProps {}

class _PaymentForm extends React.Component<Props> {
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    console.log('firebaseUser: ' + JSON.stringify(this.props.sessionStore.firebaseUser));
  }

  checkout = async (event: ChangeEvent<any>) => {
    event.preventDefault();

    if (!this.props.sessionStore.firebaseUser) {
      alert('Sorry something went wrong, please try again in a few moments...');
      return;
    }

    const {first, last, email} = this.props.sessionStore.firebaseUser;

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    const createTokenResponse = await this.props.stripe.createToken({
      name: `${first} ${last}`,
      currency: 'usd',
    });

    console.log('createTokenResponse: ' + JSON.stringify(createTokenResponse, null, 2));

    if (createTokenResponse.error) {
      console.error('Something went wrong during checkout.');
      return;
    }

    const stripeToken = createTokenResponse.token.id;
    const updatedFirebaseUser = {...this.props.sessionStore.firebaseUser, stripeToken};
    this.props.sessionStore.setFirebaseUser(updatedFirebaseUser);

    const {uid} = this.props.sessionStore.authUser;

    db.updateFirebaseUser(uid, {stripeToken}, e => {
      if (e) {
        console.log('Something went wrong while trying to save the Stripe token to SessionStore.firebaseUser');
      } else {
        console.log('User was updated with their new Stripe Token');
      }
    });

    // Create a Stripe Customer
    let createStripeCustomerResponse: any;

    try {
      createStripeCustomerResponse = await axios.post(`https://us-central1-crisis-site.cloudfunctions.net/createCustomer`, {
        email,
        token: stripeToken,
      });

      console.log('createStripeCustomerResponse: ' + JSON.stringify(createStripeCustomerResponse));
    } catch (err) {
      console.error('An error occurred while trying to create a new Stripe Customer.');
    }

    if (!createStripeCustomerResponse) {
      return;
    }

    const stripeUid = createStripeCustomerResponse.data.customer.id;

    db.updateFirebaseUser(uid, {stripeUid}, error => {
      if (error) {
        console.error('Error while trying to set Stripe UID on Firebase User. Error: ' + error);
        return;
      }

      console.log('Successfully updated Firebase User with Stripe UID');
    });

    // Subscribe to the Membership Plan in Stripe
    let subscribeToMembershipResponse: any;

    try {
      subscribeToMembershipResponse = await axios.post(`https://us-central1-crisis-site.cloudfunctions.net/subscribeToPlan`, {
        customerId: createStripeCustomerResponse.data.customer.id,
        planId: 'plan_EL3YNV4Iha9VQR',
      });

      console.log('subscribeToMembershipResponse: ' + JSON.stringify(subscribeToMembershipResponse));
    } catch (err) {
      console.error('An error occurred while attempting to subscribe to Stripe plan.');
    }

    if (!subscribeToMembershipResponse) {
      return;
    }

    const membershipPeriodEnd = subscribeToMembershipResponse.data.response.current_period_end;

    // Write the Period End value to Firebase Db
    db.updateFirebaseUser(uid, {membershipPeriodEnd}, error => {
      if (error) {
        console.error('Error while trying to write the Membership Period End value to Firebase User');
        return;
      }

      console.log('Successfully saved the Membership Period End value.');
    });

    this.props.sessionStore.setFirebaseUser({...this.props.sessionStore.firebaseUser, membershipPeriodEnd, stripeUid});
  };

  render() {
    const style = {
      base: {
        color: '#32325D',
        fontWeight: 500,
        fontFamily: 'Inter UI, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#CFD7DF',
        },
      },
      invalid: {
        color: '#E25950',
      },
    };

    return (
      <form onSubmit={this.checkout}>
        <CardElement style={style} />
        <button>ACTIVATE MEMBERSHIP</button>
      </form>
    );
  }
}

const PaymentForm = compose(
  injectStripe,
  inject(SessionStoreName)
)(_PaymentForm as ComponentClass<any>);

export default PaymentForm;

export class Checkout extends React.Component {
  render() {
    return (
      <Elements>
        <PaymentForm />
      </Elements>
    );
  }
}
