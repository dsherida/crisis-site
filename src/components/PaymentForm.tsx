import * as React from 'react';
import {ChangeEvent} from 'react';
import {CardElement, Elements, injectStripe, ReactStripeElements} from 'react-stripe-elements';
import InjectedStripeProps = ReactStripeElements.InjectedStripeProps;

interface Props extends InjectedStripeProps {}

class _PaymentForm extends React.Component<Props> {
  checkout = async (event: ChangeEvent<any>) => {
    event.preventDefault();

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    const source = await this.props.stripe.createToken({
      name: 'Mother Theresa', // `${this.props.first} ${this.props.last}`,
    });

    // You can also use createSource to create Sources. See our Sources
    // documentation for more: https://stripe.com/docs/stripe-js/reference#stripe-create-source
    // const source = await this.props.stripe.createSource({
    //   type: 'card',
    //   owner: {
    //     name: 'Test', // `${this.state.first} ${this.state.last}`,
    //     email: 'test@test.com', // `${this.state.email}`,
    //   },
    // });

    console.log('source: ' + JSON.stringify(source));
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

const PaymentForm = injectStripe(_PaymentForm);

export class Checkout extends React.Component {
  render() {
    return (
      <Elements>
        <PaymentForm />
      </Elements>
    );
  }
}
