import {TextAlignProperty} from 'csstype';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {ChangeEvent, ComponentClass} from 'react';
import ReactLoading from 'react-loading';
import {RouteComponentProps, withRouter} from 'react-router';
import {Button, Col, Container, Form, Row} from 'reactstrap';
import {compose} from 'recompose';
import FloatingTextInput from '../components/FloatingTextInput';
import withAuthorization from '../components/withAuthorization';
import {HOME, LOGIN_REGISTER} from '../constants/routes';
import * as auth from '../firebase/auth';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import SignOutButton from '../sfc/SignOutButton';
import {SessionStoreName, SessionStoreProps} from '../stores/sessionStore';
import {CommonStyle} from '../utils/CommonStyle';
import {Colors, Padding} from '../utils/Constants';

interface Props extends RouteComponentProps, SessionStoreProps {}

interface State {
  width: number;
  height: number;
  password1: string;
  password2: string;
  updatePasswordLoading: boolean;
  updatePasswordError: string;
}

class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      password1: '',
      password2: '',
      updatePasswordError: '',
      updatePasswordLoading: false,
    };
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  };

  updatePasswordOnClick = async (event: ChangeEvent<any>) => {
    event.preventDefault();

    this.setState({updatePasswordLoading: true, updatePasswordError: ''});

    try {
      await auth.doPasswordUpdate(this.state.password1);
      this.props.history.push(HOME);
    } catch (e) {
      this.setState({updatePasswordLoading: false, updatePasswordError: e.message});
    }
  };

  signOutOnClick = async (event: ChangeEvent<any>) => {
    event.preventDefault();

    try {
      await auth.doSignOut();
      this.props.history.push(LOGIN_REGISTER);
    } catch (e) {
      console.error(e.message);
    }
  };

  onChangePassword1 = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password1: event.target.value,
    });
  };
  onChangePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password2: event.target.value,
    });
  };

  render() {
    const disabled = this.state.password1 === '' || this.state.password2 === '' || this.state.password1 !== this.state.password2;

    return (
      <div style={{...CommonStyle.container, width: '100%', minHeight: this.state.height}}>
        <Container>
          <Row className="no-gutters">
            <Col>
              <Form onSubmit={(e: ChangeEvent<any>) => this.updatePasswordOnClick(e)}>
                <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={styles.header}>
                  UPDATE PASSWORD
                </CrisisText>
                <FloatingTextInput
                  value={this.state.password1}
                  onChange={this.onChangePassword1}
                  style={styles.inputGroup}
                  labelText="NEW PASSWORD"
                  secure
                />
                <FloatingTextInput
                  value={this.state.password2}
                  onChange={this.onChangePassword2}
                  style={styles.inputGroup}
                  labelText="RE-TYPE PASSWORD"
                  secure
                />
                {this.state.updatePasswordError ? (
                  <CrisisText className="text-danger" style={styles.error} font={{type: FontType.Paragraph, size: FontSize.S}}>
                    {this.state.updatePasswordError}
                  </CrisisText>
                ) : null}
                <div className="d-flex" style={styles.loadingBtnContainer}>
                  {this.state.updatePasswordLoading ? (
                    <ReactLoading type="balls" color={Colors.Primary} />
                  ) : (
                    <Button
                      type="submit"
                      style={styles.button}
                      outline
                      color="primary"
                      onClick={(e: ChangeEvent<any>) => this.updatePasswordOnClick(e)}
                      disabled={disabled}
                    >
                      UPDATE PASSWORD
                    </Button>
                  )}
                </div>
                <SignOutButton onClick={(e: ChangeEvent<any>) => this.signOutOnClick(e)} color="danger" />
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const styles = {
  inputGroup: {
    marginTop: Padding.H2,
  },
  header: {
    color: Colors.White,
    marginTop: Padding.V,
  },
  loadingBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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

const authCondition = (authUser: any) => !!authUser;

export default compose(
  withAuthorization(authCondition),
  withRouter,
  inject(SessionStoreName),
  observer
)(Profile as ComponentClass<any>);
