export class Config {
  static version: string = '1.0.0';

  static env: 'dev' | 'prod' = 'dev';

  static get stripeKey() {
    return this.env === 'dev' ? 'pk_test_dOmSREy1W5bl5BsweYvpF4LS' : 'pk_live_OtVVrSjxlJW8be81f6kWlQXk';
  }

  static start() {}
}
