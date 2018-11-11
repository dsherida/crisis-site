import * as React from 'react';
import {Button, Col, Container, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Row} from 'reactstrap';
import FloatingTextInput from '../components/FloatingTextInput';
import {HeaderHeight} from '../components/Header';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import {CommonStyle} from '../utils/CommonStyle';
import {Colors, Padding} from '../utils/Constants';

interface Props {
  id: string;
}

interface State {
  width: number;
  height: number;
}

export default class LoginRegister extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  };

  render() {
    return (
      <div style={{...CommonStyle.container, width: '100%'}}>
        <Container style={styles.container}>
          <Row className="no-gutters" style={styles.row}>
            <Col style={styles.loginCol}>
              <Form>
                <CrisisText font={{type: FontType.Paragraph, size: FontSize.S}}>Returning members.</CrisisText>
                <CrisisText font={{type: FontType.Header, size: FontSize.M}} style={styles.header}>
                  LOGIN
                </CrisisText>
                <FloatingTextInput style={styles.inputGroup} labelText="EMAIL" />
                <FloatingTextInput style={styles.inputGroup} labelText="PASSWORD" secure />
                <Button style={styles.button} outline color="primary">
                  LOGIN
                </Button>
                <Button style={styles.button} color="link">
                  FORGOT PASSWORD
                </Button>
              </Form>
            </Col>
            <Col style={styles.registerCol}>
              <Form>
                <FormGroup>
                  <CrisisText font={{type: FontType.Paragraph, size: FontSize.S}} style={styles.description}>
                    Join now to gain access to exclusive paintball sponsorships.
                  </CrisisText>
                  <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={styles.header}>
                    REGISTER
                  </CrisisText>
                  <FloatingTextInput capitalize style={styles.inputGroup} labelText="FIRST" />
                  <FloatingTextInput capitalize style={styles.inputGroup} labelText="LAST" />
                  <FloatingTextInput style={styles.inputGroup} labelText="PHONE NUMBER" />
                  <FloatingTextInput style={styles.inputGroup} labelText="EMAIL" />
                  <FloatingTextInput secure style={styles.inputGroup} labelText="PASSWORD" />
                  <FloatingTextInput secure style={styles.inputGroup} labelText="RE-TYPE PASSWORD" />
                </FormGroup>
                <Button style={styles.button} outline color="danger">
                  CREATE ACCOUNT
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const styles = {
  container: {},
  row: {
    height: '100%',
  },
  header: {
    color: Colors.White,
    marginTop: Padding.V,
  },
  inputGroup: {
    marginTop: Padding.H2,
  },
  description: {
    color: Colors.Beige,
  },
  loginCol: {
    paddingTop: Padding.V,
    paddingRight: Padding.V,
  },
  registerCol: {
    paddingTop: Padding.V,
    paddingLeft: Padding.V,
    zIndex: 1,
    background: `linear-gradient(to right, ${Colors.PrimaryLightTransparent} 0%, ${Colors.Secondary} 100%)`,
    paddingBottom: Padding.V,
  },
  button: {
    marginTop: Padding.H2,
    paddingTop: Padding.H2,
    paddingBottom: Padding.H2,
    width: '100%',
  },
};
