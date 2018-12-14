import {Colors} from './Constants';

export const CENTER = 'center' as 'center';
export const BOLD = 'bold' as 'bold';
export const REGULAR = '400' as '400';
export const SEMIBOLD = '600' as '600';
export const EXTRABOLD = '800' as '800';
export const BLACK = '900' as '900';

export const FS = {
  XS: 18,
  S: 22,
  M: 34,
  L: 48,
};

export const BorderRadius = {
  S: 3,
  M: 6,
  L: 9,
  XL: 12,
};

export const crisisGlow = (color: string = Colors.Primary) => `0px 0px 30px ${color}`;
