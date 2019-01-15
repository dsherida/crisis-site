export class Config {
  static version: string = '1.0.0';

  static env: 'dev' | 'prod' = 'dev';

  static get stripeKey() {
    // TODO: replace the prod key with actual
    return this.env === 'dev' ? 'pk_test_dOmSREy1W5bl5BsweYvpF4LS' : 'pk_test_dOmSREy1W5bl5BsweYvpF4LS';
  }

  static start() {}
}
