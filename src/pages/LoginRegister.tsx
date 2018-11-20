import {TextAlignProperty} from 'csstype';
import * as React from 'react';
import {ChangeEvent} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {Button, Col, Container, Form, FormGroup, Row} from 'reactstrap';
import FloatingTextInput from '../components/FloatingTextInput';
import {HOME} from '../constants/routes';
import {auth} from '../firebase';
import {IUser} from '../models/User';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import {CommonStyle} from '../utils/CommonStyle';
import {Colors, Padding} from '../utils/Constants';

interface Props extends RouteComponentProps {
  id: string;
}

interface State {
  width: number;
  height: number;
  loginError: string;
  registerError: string;
  user: IUser;
  retypePassword: string;
  loginEmail: string;
  loginPassword: string;
  loginLoading: boolean;
  registerLoading: boolean;
}

class LoginRegister extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      loginError: null,
      registerError: null,
      user: {
        first: '',
        last: '',
        email: '',
        phone: '',
        password: '',
      },
      retypePassword: '',
      loginEmail: '',
      loginPassword: '',
      loginLoading: false,
      registerLoading: false,
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

  loginOnClick = async (event: ChangeEvent<any>) => {
    event.preventDefault();

    this.setState({loginLoading: true});

    try {
      const loginResult = await auth.doSignInWithEmailAndPassword(this.state.loginEmail, this.state.loginPassword);
      console.log(JSON.stringify(loginResult));
      // TODO: clear the state if needed
      // this.setState({...INITIAL_STATE});
      this.props.history.push(HOME);
    } catch (e) {
      this.setState({loginError: e.message});
    }

    this.setState({loginLoading: false});
  };

  forgotPasswordOnClick = () => {
    this.setState({
      loginError: 'Forgot password not yet implemented',
    });
  };

  registerOnClick = async () => {
    this.setState({registerLoading: true});

    try {
      await auth.doCreateUserWithEmailAndPassword(this.state.user);
      this.props.history.push(HOME);
    } catch (e) {
      this.setState({
        registerError: e.message,
      });
    }

    this.setState({registerLoading: false});
  };

  onChangeLoginEmail = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      loginEmail: event.target.value,
    });
  };
  onChangeLoginPassword = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      loginPassword: event.target.value,
    });
  };
  onChangeFirst = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      user: {...this.state.user, first: event.target.value},
    });
  };
  onChangeLast = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      user: {...this.state.user, last: event.target.value},
    });
  };
  onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      user: {...this.state.user, email: event.target.value},
    });
  };
  onChangePhone = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      user: {...this.state.user, phone: event.target.value},
    });
  };
  onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      user: {...this.state.user, password: event.target.value},
    });
  };
  onChangeRetypePassword = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      retypePassword: event.target.value,
    });
  };

  render() {
    const loginDisabled = this.state.loginEmail === '' || this.state.loginPassword === '';

    const registerDisabled =
      this.state.retypePassword === '' ||
      this.state.user.password === '' ||
      this.state.user.email === '' ||
      this.state.user.phone === '' ||
      this.state.user.first === '' ||
      this.state.user.last === '';

    const passwordMismatch = this.state.user.password !== this.state.retypePassword;

    return (
      <div style={{...CommonStyle.container, width: '100%', minHeight: this.state.height}}>
        <Container style={styles.container}>
          <Row className="no-gutters" style={styles.row}>
            <Col style={styles.loginCol}>
              <Form onSubmit={(e: ChangeEvent<any>) => this.loginOnClick(e)}>
                <CrisisText font={{type: FontType.Paragraph, size: FontSize.S}}>Returning members.</CrisisText>
                <CrisisText font={{type: FontType.Header, size: FontSize.M}} style={styles.header}>
                  LOGIN
                </CrisisText>
                <FloatingTextInput value={this.state.loginEmail} onChange={this.onChangeLoginEmail} style={styles.inputGroup} labelText="EMAIL" />
                <FloatingTextInput
                  value={this.state.loginPassword}
                  onChange={this.onChangeLoginPassword}
                  style={styles.inputGroup}
                  labelText="PASSWORD"
                  secure
                />
                {this.state.loginError ? (
                  <CrisisText className="text-danger" style={styles.error} font={{type: FontType.Paragraph, size: FontSize.S}}>
                    {this.state.loginError}
                  </CrisisText>
                ) : null}
                <Button
                  type="submit"
                  style={styles.button}
                  outline
                  color="primary"
                  onClick={(e: ChangeEvent<any>) => this.loginOnClick(e)}
                  disabled={loginDisabled}
                >
                  LOGIN
                </Button>
                <Button style={styles.button} color="link" onClick={this.forgotPasswordOnClick}>
                  FORGOT PASSWORD
                </Button>
              </Form>
            </Col>
            <Col style={{...styles.registerCol, minHeight: this.state.height}}>
              <Form>
                <FormGroup>
                  <CrisisText font={{type: FontType.Paragraph, size: FontSize.S}} style={styles.description}>
                    Join now to gain access to exclusive paintball sponsorships.
                  </CrisisText>
                  <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={styles.header}>
                    REGISTER
                  </CrisisText>
                  <FloatingTextInput
                    value={this.state.user.first}
                    onChange={this.onChangeFirst}
                    capitalize
                    style={styles.inputGroup}
                    labelText="FIRST*"
                  />
                  <FloatingTextInput
                    value={this.state.user.last}
                    onChange={this.onChangeLast}
                    capitalize
                    style={styles.inputGroup}
                    labelText="LAST*"
                  />
                  <FloatingTextInput
                    value={this.state.user.phone}
                    onChange={this.onChangePhone}
                    style={styles.inputGroup}
                    labelText="PHONE NUMBER*"
                  />
                  <FloatingTextInput value={this.state.user.email} onChange={this.onChangeEmail} style={styles.inputGroup} labelText="EMAIL*" />
                  <FloatingTextInput
                    value={this.state.user.password}
                    onChange={this.onChangePassword}
                    secure
                    style={styles.inputGroup}
                    labelText="PASSWORD*"
                  />
                  <FloatingTextInput
                    value={this.state.retypePassword}
                    onChange={this.onChangeRetypePassword}
                    secure
                    style={styles.inputGroup}
                    labelText="RE-TYPE PASSWORD*"
                  />
                </FormGroup>
                {this.state.registerError ? (
                  <CrisisText className="text-danger" style={styles.error} font={{type: FontType.Paragraph, size: FontSize.S}}>
                    {this.state.registerError}
                  </CrisisText>
                ) : null}
                <Button style={styles.button} outline color="danger" onClick={this.registerOnClick} disabled={registerDisabled}>
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
  error: {
    textAlign: 'center' as TextAlignProperty,
  },
};

export default withRouter(LoginRegister);
