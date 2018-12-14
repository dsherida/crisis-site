import {FlexDirectionProperty} from 'csstype';
import * as React from 'react';
import {ReactNode, SFC} from 'react';
import {Col, Row} from 'reactstrap';
import {Colors, Padding} from '../utils/Constants';
import {crisisGlow} from '../utils/StyleUtils';
import CrisisText, {FontSize, FontType} from './CrisisText';

interface StatusDotProps {
  actionTitle?: string;
}

const StatusDot: SFC<StatusDotProps> = (props: StatusDotProps) => {
  return (
    <div style={styles.statusDotWrapper}>
      <div style={styles.statusDotInner}>
        <div style={styles.statusDot} />
        {props.actionTitle && (
          <CrisisText font={{type: FontType.Paragraph, size: FontSize.XS}} style={styles.actionText}>
            {props.actionTitle}
          </CrisisText>
        )}
      </div>
    </div>
  );
};

interface Props {
  children?: ReactNode;
}

const MembershipStatus: SFC<Props> = props => {
  return (
    <div style={styles.clickable} onClick={() => console.log('Click!')}>
      <Row style={styles.container}>
        <StatusDot />
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
    </div>
  );
};

const STATUS_DOT_SIZE = 30;

const styles = {
  clickable: {
    cursor: 'pointer',
  },
  container: {
    paddingTop: Padding.V2 / 2,
    paddingLeft: Padding.H,
  },
  statusDotWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  statusDotInner: {
    display: 'flex',
    flexDirection: 'column' as FlexDirectionProperty,
    justifyContent: 'center',
  },
  statusDot: {
    width: STATUS_DOT_SIZE,
    height: STATUS_DOT_SIZE,
    borderRadius: STATUS_DOT_SIZE / 2,
    backgroundColor: Colors.Primary,
    boxShadow: crisisGlow(Colors.Primary),
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
