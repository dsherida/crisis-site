export interface IUser {
  id?: string;
  first?: string;
  last?: string;
  email?: string;
  phone?: string;
  password?: string;
  playerNumber?: string;
  position?: string;
  division?: string;
  avatarUrl?: string;
  stripeToken?: string;
  stripeUid?: string;
  membershipPeriodEnd?: number;
  card?: ICreditCard;
  subscriptionId?: string;
  canceledAt?: number;
}

export interface ICreditCard {
  id?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  last4?: string;
}