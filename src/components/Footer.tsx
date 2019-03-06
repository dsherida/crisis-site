import {PositionProperty, TextAlignProperty} from 'csstype';
import * as React from 'react';
import {ReactNode, SFC} from 'react';
import {Container, Row} from 'reactstrap';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import {CommonStyle} from '../utils/CommonStyle';
import {Colors, Padding} from '../utils/Constants';

interface Props {
  children?: ReactNode;
}

const Footer: SFC<Props> = props => {
  return (
    <Container fluid>
      <Row style={styles.default}>
        <CrisisText style={styles.title} font={{type: FontType.Paragraph, size: FontSize.XS}}>
          Copper State Crisis, Corp. ©2019
        </CrisisText>
        <CrisisText style={styles.title} font={{type: FontType.Paragraph, size: FontSize.XS}}>
          480.278.2915
        </CrisisText>
      </Row>
    </Container>
  );
};

const styles = {
  default: {
    backgroundColor: Colors.secondaryDark,
    paddingTop: Padding.V2,
    paddingBottom: Padding.V2,
  },
  title: {
    flex: 1,
    textAlign: 'center' as TextAlignProperty,
    color: Colors.gray,
  },
};

export default Footer;
