import * as React from 'react';
import {Button, Col, Container, Form, FormGroup, Input, InputGroup, InputGroupAddon, Row} from 'reactstrap';
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
      <div style={{...CommonStyle.container, width: '100%', height: this.state.height}}>
        <Container style={styles.container}>
          <Row style={styles.row}>
            <Col style={styles.loginCol}>
              <Form>
                <FormGroup>
                  <CrisisText font={{type: FontType.Paragraph, size: FontSize.S}}>Returning members.</CrisisText>
                  <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={styles.header}>
                    LOGIN
                  </CrisisText>
                  <InputGroup style={styles.inputGroup} size="lg">
                    <InputGroupAddon addonType="prepend">EMAIL</InputGroupAddon>
                    <Input />
                  </InputGroup>
                  <InputGroup style={styles.inputGroup} size="lg">
                    <InputGroupAddon addonType="prepend">PASSWORD</InputGroupAddon>
                    <Input type="password" />
                  </InputGroup>
                </FormGroup>
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
                  <InputGroup style={styles.inputGroup} size="lg">
                    <InputGroupAddon addonType="prepend">FIRST</InputGroupAddon>
                    <Input />
                  </InputGroup>
                  <InputGroup style={styles.inputGroup} size="lg">
                    <InputGroupAddon addonType="prepend">LAST</InputGroupAddon>
                    <Input />
                  </InputGroup>
                  <InputGroup style={styles.inputGroup} size="lg">
                    <InputGroupAddon addonType="prepend">PHONE NUMBER</InputGroupAddon>
                    <Input />
                  </InputGroup>
                  <InputGroup style={styles.inputGroup} size="lg">
                    <InputGroupAddon addonType="prepend">EMAIL</InputGroupAddon>
                    <Input />
                  </InputGroup>
                  <InputGroup style={styles.inputGroup} size="lg">
                    <InputGroupAddon addonType="prepend">PASSWORD</InputGroupAddon>
                    <Input type="password" />
                  </InputGroup>
                  <InputGroup style={styles.inputGroup} size="lg">
                    <InputGroupAddon addonType="prepend">RE-TYPE PASSWORD</InputGroupAddon>
                    <Input type="password" />
                  </InputGroup>
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
  container: {
    height: '100%',
  },
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
  },
  registerCol: {
    paddingTop: Padding.V,
    zIndex: 1,
    background: `linear-gradient(to right, ${Colors.PrimaryLightTransparent} 0%, ${Colors.Secondary} 100%)`,
  },
  button: {
    marginTop: Padding.H2,
    paddingTop: Padding.H2,
    paddingBottom: Padding.H2,
    width: '100%',
  },
};
