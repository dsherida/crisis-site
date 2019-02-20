import {PositionProperty} from 'csstype';
import * as React from 'react';
import {ReactNode, SFC} from 'react';
import {Config} from '../Config';
import CrisisText, {FontSize, FontType} from './CrisisText';
import {Colors} from '../utils/Constants';

interface Props {
  width: number;
  children?: ReactNode;
}

const getBootstrapSizeClass = (width: number) => {
  if (width < 768) {
    return 'xs';
  } else if (width >= 768 && width < 992) {
    return 'sm';
  } else if (width >= 992 && width < 1200) {
    return 'md';
  } else if (width >= 1200) {
    return 'lg';
  } else {
    return 'unknown size class';
  }
};

const BootstrapSizeClassHelper: SFC<Props> = props => {
  if (Config.env === 'dev') {
    return (
      <CrisisText font={{type: FontType.Paragraph, size: FontSize.XS}} style={styles.default}>
        {getBootstrapSizeClass(props.width)}
      </CrisisText>
    );
  }

  return null;
};

const styles = {
  default: {
    position: 'absolute' as PositionProperty,
    top: 0,
    left: 0,
    color: Colors.gray,
  },
};

export default BootstrapSizeClassHelper;
