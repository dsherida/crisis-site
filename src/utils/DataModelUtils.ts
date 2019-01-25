import {ICreditCard} from '../models/User';
import checkType = stripe.checkType;
import brandType = stripe.brandType;
import fundingType = stripe.fundingType;
import tokenizationType = stripe.tokenizationType;

interface StripeCard {
  id: string;
  object: string;
  address_city?: string;
  address_country?: string;
  address_line1?: string;
  address_line1_check?: checkType;
  address_line2?: string;
  address_state?: string;
  address_zip?: string;
  address_zip_check?: checkType;
  brand: brandType;
  country: string;
  currency?: string;
  cvc_check?: checkType;
  dynamic_last4: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: fundingType;
  last4: string;
  metadata: any;
  name?: string;
  tokenization_method?: tokenizationType;
  three_d_secure?: 'required' | 'recommended' | 'optional' | 'not_supported';
}

export default class DataModelUtils {
  static stripeCardToCrisisApi = (card: StripeCard): ICreditCard => {
    return {
      id: card.id,
      brand: card.brand,
      expMonth: card.exp_month,
      expYear: card.exp_year,
      last4: card.last4,
    };
  };
}
