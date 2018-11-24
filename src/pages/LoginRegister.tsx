import {TextAlignProperty} from 'csstype';
import {ChangeEvent} from 'react';
import * as React from 'react';
import ReactLoading from 'react-loading';
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
  forgotPassword: boolean;
  forgotPasswordEmail: string;
  passwordResetError: string;
  passwordResetLoading: boolean;
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
      forgotPassword: false,
      forgotPasswordEmail: '',
      passwordResetError: '',
      passwordResetLoading: false,
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

    this.setState({loginLoading: true, loginError: ''});

    try {
      await auth.doSignInWithEmailAndPassword(this.state.loginEmail, this.state.loginPassword);
      this.props.history.push(HOME);
    } catch (e) {
      this.setState({loginLoading: false, loginError: e.message});
    }
  };

  renderLogin = () => {
    const loginDisabled = this.state.loginEmail === '' || this.state.loginPassword === '';

    return (
      <Form onSubmit={(e: ChangeEvent<any>) => this.loginOnClick(e)}>
        <CrisisText font={{type: FontType.Paragraph, size: FontSize.S}}>Returning members.</CrisisText>
        <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={styles.header}>
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
        <div className="d-flex" style={styles.loadingBtnContainer}>
          {this.state.loginLoading ? (
            <ReactLoading type="balls" color={Colors.Primary} />
          ) : (
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
          )}
        </div>
        <Button style={styles.button} color="link" onClick={this.forgotPasswordOnClick}>
          FORGOT PASSWORD
        </Button>
      </Form>
    );
  };

  forgotPasswordOnClick = () => {
    this.setState({
      forgotPassword: !this.state.forgotPassword,
    });
  };

  passwordResetOnClick = async (event: ChangeEvent<any>) => {
    event.preventDefault();

    this.setState({
      passwordResetLoading: true,
      passwordResetError: '',
    });

    try {
      await auth.doPasswordReset(this.state.forgotPasswordEmail);
      // TODO: reset initial state if needed
      this.setState({
        forgotPassword: false,
        loginError: 'Please check your email for a link to reset your password',
      });
    } catch (e) {
      this.setState({
        passwordResetLoading: false,
        passwordResetError: e.message,
      });
    }
  };

  renderForgotPassword = () => {
    const isInvalid = this.state.forgotPasswordEmail === '';

    return (
      <Form onSubmit={(e: ChangeEvent<any>) => this.passwordResetOnClick(e)}>
        <CrisisText font={{type: FontType.Paragraph, size: FontSize.S}}>Enter your email to reset your password</CrisisText>
        <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={styles.header}>
          PASSWORD RESET
        </CrisisText>
        <FloatingTextInput
          value={this.state.forgotPasswordEmail}
          onChange={this.onChangeForgotPasswordEmail}
          style={styles.inputGroup}
          labelText="EMAIL"
        />
        {this.state.passwordResetError ? (
          <CrisisText className="text-danger" style={styles.error} font={{type: FontType.Paragraph, size: FontSize.S}}>
            {this.state.passwordResetError}
          </CrisisText>
        ) : null}
        <div className="d-flex" style={styles.loadingBtnContainer}>
          {this.state.passwordResetLoading ? (
            <ReactLoading type="balls" color={Colors.Primary} />
          ) : (
            <Button
              type="submit"
              style={styles.button}
              outline
              color="primary"
              onClick={(e: ChangeEvent<any>) => this.passwordResetOnClick(e)}
              disabled={isInvalid}
            >
              RESET PASSWORD
            </Button>
          )}
        </div>
        <Button style={styles.button} color="link" onClick={this.forgotPasswordOnClick}>
          BACK TO LOGIN
        </Button>
      </Form>
    );
  };

  registerOnClick = async (event: ChangeEvent<any>) => {
    event.preventDefault();

    this.setState({registerLoading: true, registerError: ''});

    try {
      await auth.doCreateUserWithEmailAndPassword(this.state.user);
      this.props.history.push(HOME);
    } catch (e) {
      this.setState({
        registerLoading: false,
        registerError: e.message,
      });
    }
  };

  renderRegister = () => {
    const passwordMismatch = this.state.user.password !== this.state.retypePassword;

    const registerDisabled =
      this.state.retypePassword === '' ||
      this.state.user.password === '' ||
      this.state.user.email === '' ||
      this.state.user.phone === '' ||
      this.state.user.first === '' ||
      this.state.user.last === '' ||
      passwordMismatch;

    return (
      <Form onSubmit={(e: ChangeEvent<any>) => this.registerOnClick(e)}>
        <FormGroup>
          <CrisisText font={{type: FontType.Paragraph, size: FontSize.S}} style={styles.description}>
            Join now to gain access to exclusive paintball sponsorships.
          </CrisisText>
          <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={styles.header}>
            REGISTER
          </CrisisText>
          <FloatingTextInput value={this.state.user.first} onChange={this.onChangeFirst} capitalize style={styles.inputGroup} labelText="FIRST*" />
          <FloatingTextInput value={this.state.user.last} onChange={this.onChangeLast} capitalize style={styles.inputGroup} labelText="LAST*" />
          <FloatingTextInput value={this.state.user.phone} onChange={this.onChangePhone} style={styles.inputGroup} labelText="PHONE NUMBER*" />
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
        <div className="d-flex" style={styles.loadingBtnContainer}>
          {this.state.registerLoading ? (
            <ReactLoading type="balls" color={Colors.Primary} />
          ) : (
            <Button
              type="submit"
              style={styles.button}
              outline
              color="danger"
              onClick={(e: ChangeEvent<any>) => this.registerOnClick(e)}
              disabled={registerDisabled}
            >
              CREATE ACCOUNT
            </Button>
          )}
        </div>
      </Form>
    );
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
  onChangeForgotPasswordEmail = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      forgotPasswordEmail: event.target.value,
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
    return (
      <div style={{...CommonStyle.container, width: '100%', minHeight: this.state.height}}>
        <Container style={styles.container}>
          <Row className="no-gutters" style={styles.row}>
            <Col style={styles.loginCol}>{this.state.forgotPassword ? this.renderForgotPassword() : this.renderLogin()}</Col>
            <Col style={{...styles.registerCol, minHeight: this.state.height}}>{this.renderRegister()}</Col>
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
  loadingBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
