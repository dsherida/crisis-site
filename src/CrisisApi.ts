import axios from 'axios';
import {Config} from './Config';

export default class CrisisApi {
  static get baseUrl() {
    return Config.env === 'dev' ? 'https://us-central1-crisis-site.cloudfunctions.net' : 'https://us-central1-crisis-site-prod.cloudfunctions.net';
  }

  static get membershipPlanId() {
    return Config.env === 'dev' ? 'plan_EL3YNV4Iha9VQR' : 'plan_EL2v9CNbBPWsGo';
  }

  static createStripeCustomer(email: string, stripeToken: string) {
    return axios.post(`${CrisisApi.baseUrl}/createCustomer`, {
      email,
      token: stripeToken,
    });
  }

  static subscribeToMembership(stripeUid: string) {
    return axios.post(`${CrisisApi.baseUrl}/subscribeToPlan`, {
      customerId: stripeUid,
      planId: CrisisApi.membershipPlanId,
    });
  }

  static updateCustomerCard(stripeUid: string, stripeToken: string) {
    return axios.post(`${CrisisApi.baseUrl}/updateCustomerCard`, {
      customerId: stripeUid,
      token: stripeToken,
    });
  }

  static cancelSubscription(subscriptionId: string) {
    return axios.post(`${CrisisApi.baseUrl}/cancelSubscription`, {
      subscriptionId,
    });
  }

  static resumeSubscription(subscriptionId: string) {
    return axios.post(`${CrisisApi.baseUrl}/resumeSubscription`, {
      subscriptionId,
    });
  }
}
