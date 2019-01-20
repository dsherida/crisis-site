import {FlexDirectionProperty} from 'csstype';
import * as React from 'react';
import {ReactNode, SFC} from 'react';
import {Col, Row} from 'reactstrap';
import {Colors, Padding} from '../utils/Constants';
import {crisisGlow} from '../utils/StyleUtils';
import CrisisText, {FontSize, FontType} from './CrisisText';

interface StatusDotProps {
  actionTitle?: string;
  active: boolean;
}

const StatusDot: SFC<StatusDotProps> = (props: StatusDotProps) => {
  return (
    <div style={styles.statusDotWrapper}>
      <div style={styles.statusDotInner}>
        <div
          style={{
            ...styles.statusDot,
            backgroundColor: props.active ? Colors.Primary : Colors.Secondary,
            boxShadow: props.active ? crisisGlow(Colors.Primary) : null,
            borderWidth: props.active === false ? '2px' : '0px',
            borderColor: props.active === false ? Colors.Gray : null,
            borderStyle: 'solid',
          }}
        />
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
  active: boolean;
  billedNext: number;
}

const MembershipStatus: SFC<Props> = props => {
  return (
    <div style={styles.clickable} onClick={() => console.log('Click!')}>
      <Row style={styles.container}>
        <StatusDot active={props.active} />
        <Col>
          <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={styles.headerText}>
            STATUS
          </CrisisText>
          <CrisisText
            font={{type: FontType.Paragraph, size: FontSize.L}}
            style={{
              ...styles.statusText,
              color: props.active === false ? Colors.Red : Colors.Primary,
            }}
          >
            {props.active ? 'ACTIVE' : 'INACTIVE'}
          </CrisisText>
          <CrisisText font={{type: FontType.Paragraph, size: FontSize.XS}} style={styles.statusSubtext}>
            {props.active
              ? `Billed next on ${new Date(props.billedNext).toLocaleDateString()}`
              : 'Pay now using our Stripe secure checkout and get access to team benefits at your next field outing.'}
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
