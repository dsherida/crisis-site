import axios from 'axios';
import {TextAlignProperty} from 'csstype';
import {inject} from 'mobx-react';
import * as React from 'react';
import {ChangeEvent, ComponentClass} from 'react';
import {CardElement, Elements, injectStripe, ReactStripeElements} from 'react-stripe-elements';
import {compose} from 'recompose';
import {db} from '../firebase';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import {strokeButtonStyle} from '../sfc/StrokeButton';
import {SessionStoreName, SessionStoreProps} from '../stores/sessionStore';
import {Colors} from '../utils/Constants';
import DataModelUtils from '../utils/DataModelUtils';
import InjectedStripeProps = ReactStripeElements.InjectedStripeProps;
import {BorderRadius} from '../utils/StyleUtils';

interface Props extends InjectedStripeProps, SessionStoreProps {
  updatingCard: boolean;
}

interface State {
  paymentError: string;
}

class _PaymentForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paymentError: '',
    };
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    console.log('firebaseUser: ' + JSON.stringify(this.props.sessionStore.firebaseUser));
  }

  updateCard = async (event: ChangeEvent<any>) => {
    event.preventDefault();

    // TODO: Implement update card
    console.log('TODO: Implement update card');
  };

  checkout = async (event: ChangeEvent<any>) => {
    event.preventDefault();

    if (!this.props.sessionStore.firebaseUser) {
      alert('Sorry something went wrong, please try again in a few moments...');
      return;
    }

    const {first, last, email} = this.props.sessionStore.firebaseUser;

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    let createTokenResponse;
    try {
      createTokenResponse = await this.props.stripe.createToken({
        name: `${first} ${last}`,
        currency: 'usd',
      });
      console.log('createTokenResponse: ' + JSON.stringify(createTokenResponse, null, 2));
    } catch (err) {
      console.log('An error occurred while attempting to create a Stripe Token. Error: ' + err.message);
      this.setState({paymentError: err.message});
      return;
    }

    if (createTokenResponse.error) {
      console.error('Something went wrong during checkout. Error: ' + createTokenResponse.error.message);
      this.setState({paymentError: createTokenResponse.error.message});
      return;
    }

    const stripeToken = createTokenResponse.token.id;
    const card = DataModelUtils.stripeCardToCrisisApi(createTokenResponse.token.card);

    const updatedFirebaseUser = {...this.props.sessionStore.firebaseUser, stripeToken};
    this.props.sessionStore.setFirebaseUser(updatedFirebaseUser);

    const {uid} = this.props.sessionStore.authUser;

    db.updateFirebaseUser(uid, {stripeToken, card}, e => {
      if (e) {
        console.log('Something went wrong while trying to save the Stripe token to SessionStore.firebaseUser');
        this.setState({paymentError: e.message});
      } else {
        console.log('User was updated with their new Stripe Token and Credit Card');
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
      this.setState({paymentError: err.message});
      return;
    }

    const stripeUid = createStripeCustomerResponse.data.customer.id;

    db.updateFirebaseUser(uid, {stripeUid}, error => {
      if (error) {
        console.error('Error while trying to set Stripe UID on Firebase User. Error: ' + error);
        this.setState({paymentError: error.message});
        return;
      } else {
        console.log('Successfully updated Firebase User with Stripe UID');
      }
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
      this.setState({paymentError: err.message});
    }

    const membershipPeriodEnd = subscribeToMembershipResponse.data.response.current_period_end;

    // Write the Period End value to Firebase Db
    db.updateFirebaseUser(uid, {membershipPeriodEnd}, error => {
      if (error) {
        console.error('Error while trying to write the Membership Period End value to Firebase User');
        this.setState({paymentError: error.message});
        return;
      } else {
        console.log('Successfully saved the Membership Period End value.');
      }
    });

    this.props.sessionStore.setFirebaseUser({...this.props.sessionStore.firebaseUser, membershipPeriodEnd, stripeUid, card});
  };

  render() {
    const style = {
      base: {
        color: '#32325d',
        lineHeight: '18px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };

    return (
      <form onSubmit={this.props.updatingCard ? this.updateCard : this.checkout} style={{backgroundColor: Colors.transparent}}>
        {this.state.paymentError ? (
          <CrisisText className="text-danger" style={styles.error} font={{type: FontType.Paragraph, size: FontSize.S}}>
            {this.state.paymentError}
          </CrisisText>
        ) : null}
        <CardElement style={style} />
        <button
          className="btn-outline-primary"
          style={{
            ...strokeButtonStyle.button,
            borderRadius: BorderRadius.M,
            cursor: 'pointer',
          }}
        >
          {this.props.updatingCard ? 'UPDATE CARD' : 'ACTIVATE MEMBERSHIP'}
        </button>
      </form>
    );
  }
}

const styles = {
  error: {
    textAlign: 'center' as TextAlignProperty,
  },
};

const PaymentForm = compose<State, Props>(
  injectStripe,
  inject(SessionStoreName)
)(_PaymentForm as ComponentClass<any>);

export default PaymentForm;

interface CheckoutProps {
  updatingCard?: boolean;
}

export class Checkout extends React.Component<CheckoutProps> {
  render() {
    return (
      <Elements>
        <PaymentForm updatingCard={this.props.updatingCard} />
      </Elements>
    );
  }
}
