import {PositionProperty} from 'csstype';
import * as React from 'react';
import {CSSProperties} from 'react';
import {Col, Container, Row} from 'reactstrap';
import {Assets} from '../assets';
import CrisisButton from '../sfc/CrisisButton';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import {Colors} from '../utils/Constants';

interface Props {
  id: string;
}

export default class TopNavBar extends React.Component {
  constructor(props: Props) {
    super(props);
  }

  playersOnClick = () => {
    console.log('playersOnClick');
  };

  loginRegisterOnClick = () => {
    console.log('loginRegisterOnClick');
  };

  render() {
    return (
      <div style={styles.container}>
        <Container>
          <Row>
            <Col className="d-flex justify-content-center align-items-center">
              <CrisisButton color={Colors.Primary} style={styles.navLink} onClick={this.playersOnClick}>
                PLAYERS
              </CrisisButton>
            </Col>
            <Col className="d-flex" style={styles.imageRow}>
              <img style={{position: 'absolute'}} src={Assets.src.crisis_logo} />
            </Col>
            <Col className="d-flex justify-content-center align-items-center">
              <CrisisButton color={Colors.Primary} style={styles.navLink} onClick={this.loginRegisterOnClick}>
                LOGIN/REGISTER
              </CrisisButton>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: Colors.Secondary,
  },
  imageRow: {
    justifyContent: 'center',
    height: 200,
  },
  main: {
    bottom: 0,
  },
  navLink: {},
};
