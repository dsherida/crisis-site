import * as React from 'react';
import {ReactNode, SFC} from 'react';
import {Col, Row} from 'reactstrap';
import {Colors, Padding} from '../utils/Constants';
import CrisisText, {FontSize, FontType} from './CrisisText';
import {FlexDirectionProperty} from 'csstype';

interface StatusDotProps {
  actionTitle: string;
}

const StatusDot: SFC<StatusDotProps> = (props: StatusDotProps) => {
  return (
    <div style={styles.statusDotWrapper}>
      <div style={styles.statusDotInner}>
        <div style={styles.statusDot} />
        <CrisisText font={{type: FontType.Paragraph, size: FontSize.XS}} style={styles.actionText}>
          {props.actionTitle}
        </CrisisText>
      </div>
    </div>
  );
};

interface Props {
  children?: ReactNode;
}

const MembershipStatus: SFC<Props> = props => {
  return (
    <Row style={styles.container}>
      <StatusDot actionTitle="PAUSE" />
      <Col>
        <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={styles.headerText}>
          STATUS
        </CrisisText>
        <CrisisText font={{type: FontType.Paragraph, size: FontSize.L}} style={styles.statusText}>
          ACTIVE
        </CrisisText>
        <CrisisText font={{type: FontType.Paragraph, size: FontSize.XS}} style={styles.statusSubtext}>
          Billed next on December 17th, 2018
        </CrisisText>
      </Col>
    </Row>
  );
};

const STATUS_DOT_SIZE = 30;

const styles = {
  container: {
    paddingTop: Padding.V2 / 2,
    paddingLeft: Padding.H,
  },
  statusDotWrapper: {
    borderStyle: 'solid',
    borderWidth: '5px',
    borderColor: 'red',
  },
  statusDotInner: {
    display: 'flex',
    flexDirection: 'column' as FlexDirectionProperty,
    justifyContent: 'center',
    borderStyle: 'solid',
    borderWidth: '5px',
    borderColor: 'blue',
  },
  statusDot: {
    width: STATUS_DOT_SIZE,
    height: STATUS_DOT_SIZE,
    borderRadius: STATUS_DOT_SIZE / 2,
    backgroundColor: Colors.Primary,
  },
  actionText: {
    color: Colors.Red,
  },
  headerText: {
    color: Colors.Beige,
  },
  statusText: {
    color: Colors.Primary,
  },
  statusSubtext: {
    color: Colors.White,
  },
};

export default MembershipStatus;
