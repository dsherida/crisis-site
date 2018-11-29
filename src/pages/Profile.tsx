import {TextAlignProperty} from 'csstype';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {ChangeEvent, ComponentClass, Fragment} from 'react';
import ReactLoading from 'react-loading';
import {RouteComponentProps, withRouter} from 'react-router';
import {Button, Col, Container, Form, FormGroup, Row} from 'reactstrap';
import {compose} from 'recompose';
import {Assets} from '../assets';
import FloatingTextInput from '../components/FloatingTextInput';
import withAuthorization from '../components/withAuthorization';
import {HOME, LOGIN_REGISTER} from '../constants/routes';
import * as auth from '../firebase/auth';
import {IUser} from '../models/User';
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
  first: string;
  last: string;
  email: string;
  phone: string;
  password: string;
  playerNumber: string;
  position: string;
  division: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  ccv: string;
  zipCode: string;
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
      first: '',
      last: '',
      email: '',
      phone: '',
      password: '',
      playerNumber: '',
      position: '',
      division: '',
      cardNumber: '',
      expMonth: '',
      expYear: '',
      ccv: '',
      zipCode: '',
    };
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  };

  byPropKey = (propName: string, value: any) => (): {} => ({
    [propName]: value,
  });

  inputOnChange = (propName: string, event: ChangeEvent<HTMLInputElement>) => {
    this.setState(this.byPropKey(propName, event.target.value));
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

  renderPlayerCard = () => {
    return (
      <Fragment>
        <CrisisText font={{type: FontType.Header, size: FontSize.XS}} style={styles.header}>
          PLAYER CARD
        </CrisisText>
        <img src={Assets.src['Player Card']} />
      </Fragment>
    );
  };

  renderPlayerInfoForm = () => {
    return (
      <Form>
        <CrisisText font={{type: FontType.Header, size: FontSize.XS}} style={styles.header}>
          PLAYER INFO
        </CrisisText>
        <FloatingTextInput
          value={this.state.first}
          onChange={event => this.inputOnChange('first', event)}
          capitalize
          style={styles.inputGroup}
          labelText="FIRST"
        />
        <FloatingTextInput
          value={this.state.last}
          onChange={event => this.inputOnChange('last', event)}
          capitalize
          style={styles.inputGroup}
          labelText="LAST"
        />
        <FloatingTextInput
          value={this.state.playerNumber}
          onChange={event => this.inputOnChange('playerNumber', event)}
          style={styles.inputGroup}
          labelText="PLAYER NUMBER"
        />
        <FloatingTextInput
          value={this.state.position}
          onChange={event => this.inputOnChange('position', event)}
          style={styles.inputGroup}
          labelText="POSITION"
        />
        <FloatingTextInput
          value={this.state.division}
          onChange={event => this.inputOnChange('division', event)}
          style={styles.inputGroup}
          labelText="DIVISION"
        />

        <CrisisText font={{type: FontType.Header, size: FontSize.XS}} style={styles.header}>
          CONTACT INFO
        </CrisisText>
        <FloatingTextInput
          value={this.state.email}
          onChange={event => this.inputOnChange('email', event)}
          capitalize
          style={styles.inputGroup}
          labelText="EMAIL"
        />
        <FloatingTextInput
          value={this.state.phone}
          onChange={event => this.inputOnChange('phone', event)}
          capitalize
          style={styles.inputGroup}
          labelText="PHONE"
        />
      </Form>
    );
  };

  renderUpdatePasswordForm = () => {
    const disabled = this.state.password1 === '' || this.state.password2 === '' || this.state.password1 !== this.state.password2;

    return (
      <Form onSubmit={(e: ChangeEvent<any>) => this.updatePasswordOnClick(e)}>
        <CrisisText font={{type: FontType.Header, size: FontSize.XS}} style={styles.header}>
          UPDATE PASSWORD
        </CrisisText>
        <FloatingTextInput
          value={this.state.password1}
          onChange={event => this.inputOnChange('password1', event)}
          style={styles.inputGroup}
          labelText="NEW PASSWORD"
          secure
        />
        <FloatingTextInput
          value={this.state.password2}
          onChange={event => this.inputOnChange('password2', event)}
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
    );
  };

  renderMembershipForm = () => {
    return (
      <Fragment>
        <CrisisText font={{type: FontType.Header, size: FontSize.XS}} style={styles.header}>
          MEMBERSHIP
        </CrisisText>
        <img src={Assets.src.Membership} />
        <CrisisText font={{type: FontType.Header, size: FontSize.XS}} style={styles.header}>
          PAYMENT
        </CrisisText>
        <FloatingTextInput
          value={this.state.cardNumber}
          onChange={event => this.inputOnChange('cardNumber', event)}
          capitalize
          style={styles.inputGroup}
          labelText="CARD NUMBER"
        />
        <Row>
          <Col>
            <FloatingTextInput
              value={this.state.expMonth}
              onChange={event => this.inputOnChange('expMonth', event)}
              capitalize
              style={styles.inputGroup}
              labelText="EXP. MONTH"
            />
          </Col>
          <Col>
            <FloatingTextInput
              value={this.state.expYear}
              onChange={event => this.inputOnChange('expYear', event)}
              capitalize
              style={styles.inputGroup}
              labelText="EXP. YEAR"
            />
          </Col>
        </Row>
        <FloatingTextInput
          value={this.state.ccv}
          onChange={event => this.inputOnChange('ccv', event)}
          capitalize
          style={styles.inputGroup}
          labelText="CVC/CCV"
        />
        <FloatingTextInput
          value={this.state.zipCode}
          onChange={event => this.inputOnChange('zipCode', event)}
          capitalize
          style={styles.inputGroup}
          labelText="ZIP CODE"
        />
      </Fragment>
    );
  };

  render() {
    return (
      <div style={{...CommonStyle.container, ...styles.container, minHeight: this.state.height}}>
        <Container>
          <Row className="no-gutters">
            <Col style={styles.profileColumn}>{this.renderPlayerCard()}</Col>
            <Col style={styles.profileColumn}>
              {this.renderPlayerInfoForm()}
              {this.renderUpdatePasswordForm()}
            </Col>
            <Col style={styles.profileColumn}>{this.renderMembershipForm()}</Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const styles = {
  container: {
    width: '100%',
    paddingBottom: Padding.V,
  },
  inputGroup: {
    marginTop: Padding.H2,
  },
  header: {
    color: Colors.Gray,
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
  profileColumn: {
    paddingRight: Padding.H,
  },
};

const authCondition = (authUser: any) => !!authUser;

export default compose(
  withAuthorization(authCondition),
  withRouter,
  inject(SessionStoreName),
  observer
)(Profile as ComponentClass<any>);
