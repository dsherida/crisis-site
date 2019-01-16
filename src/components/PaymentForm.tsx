import axios from 'axios';
import {inject} from 'mobx-react';
import * as React from 'react';
import {ChangeEvent, ComponentClass} from 'react';
import {CardElement, Elements, injectStripe, ReactStripeElements} from 'react-stripe-elements';
import InjectedStripeProps = ReactStripeElements.InjectedStripeProps;
import {compose} from 'recompose';
import {db} from '../firebase';
import {SessionStoreName, SessionStoreProps} from '../stores/sessionStore';

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

    const stripeToken = createTokenResponse.token.id;
    const updatedFirebaseUser = {...this.props.sessionStore.firebaseUser, stripeToken};
    this.props.sessionStore.setFirebaseUser(updatedFirebaseUser);

    db.updateFirebaseUser(this.props.sessionStore.authUser.uid, {stripeToken}, e => {
      if (e) {
        console.log('Something went wrong while trying to save the Stripe token to SessionStore.firebaseUser');
      } else {
        console.log('User was updated with their new Stripe Token');
      }
    });

    // Create a Stripe Customer
    axios
      .post(`https://us-central1-crisis-site.cloudfunctions.net/createCustomer?token=tok_1Dt64OEzetDhGLoKHYVfq08o`, {email, token: stripeToken})
      .then(res => {
        console.log('res: ' + JSON.stringify(res));
      });
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
      <form onSubmit={this.checkout}>
        <CardElement style={style} />
        <button>Confirm order</button>
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
