import axios from 'axios';

export default class CrisisApi {
  static cancelSubscription(subscriptionId: string) {
    return axios.post(`https://us-central1-crisis-site.cloudfunctions.net/cancelSubscription`, {
      subscriptionId,
    });
  }

  static resumeSubscription(subscriptionId: string) {
    return axios.post('https://us-central1-crisis-site.cloudfunctions.net/resumeSubscription', {
      subscriptionId,
    });
  }
}
