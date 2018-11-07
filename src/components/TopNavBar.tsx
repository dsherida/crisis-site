import {PositionProperty} from 'csstype';
import * as React from 'react';
import {CSSProperties} from 'react';
import {Col, Container, Row} from 'reactstrap';
import {Assets} from '../assets';
import Text, {FontSize, FontType} from '../sfc/Text';
import {Colors} from '../utils/Constants';

interface Props {
  id: string;
}

export default class TopNavBar extends React.Component {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.container}>
        <Container>
          <Row>
            <Col className="d-flex justify-content-center align-items-center">
              <Text font={{size: FontSize.M, type: FontType.Paragraph}} style={styles.navLink}>
                PLAYERS
              </Text>
            </Col>
            <Col className="d-flex" style={styles.imageRow}>
              <img style={{position: 'absolute'}} src={Assets.src.crisis_logo} />
            </Col>
            <Col className="d-flex justify-content-center align-items-center">
              <Text font={{size: FontSize.M, type: FontType.Paragraph}} style={styles.navLink}>
                LOGIN/REGISTER
              </Text>
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
  navLink: {
    color: Colors.Gray,
  },
};
