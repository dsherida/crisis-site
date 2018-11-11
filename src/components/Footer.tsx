import {PositionProperty, TextAlignProperty} from 'csstype';
import * as React from 'react';
import {ReactNode, SFC} from 'react';
import {Container} from 'reactstrap';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import {CommonStyle} from '../utils/CommonStyle';
import {Colors} from '../utils/Constants';

interface Props {
  children?: ReactNode;
}

const Footer: SFC<Props> = props => {
  return (
    <div style={styles.default}>
      <CrisisText style={styles.title} font={{type: FontType.Header, size: FontSize.S}}>
        Copper State Crisis © 2018
      </CrisisText>
    </div>
  );
};

const styles = {
  default: {
    position: 'absolute' as PositionProperty,
    backgroundColor: Colors.Primary,
    bottom: 0,
    left: 0,
    right: 0,
  },
  title: {
    textAlign: 'center' as TextAlignProperty,
    color: Colors.Gray,
  },
};

export default Footer;
