import {TextAlignProperty} from 'csstype';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {ChangeEvent, ComponentClass, Fragment} from 'react';
import ReactLoading from 'react-loading';
import {RouteComponentProps, withRouter} from 'react-router';
import {injectStripe, ReactStripeElements} from 'react-stripe-elements';
import {Button, Col, Container, Form, Row} from 'reactstrap';
import {compose} from 'recompose';
import FloatingTextInput from '../components/FloatingTextInput';
import {Checkout} from '../components/PaymentForm';
import withAuthorization from '../components/withAuthorization';
import {HOME, LOGIN_REGISTER} from '../constants/routes';
import {db} from '../firebase';
import * as auth from '../firebase/auth';
import {storage} from '../firebase/firebase';
import {getPlayerImageUrl} from '../firebase/storage';
import {ICreditCard, IUser} from '../models/User';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import LinkButton from '../sfc/LinkButton';
import MembershipStatus from '../sfc/MembershipStatus';
import PlayerCard from '../sfc/PlayerCard';
import StrokeButton from '../sfc/StrokeButton';
import {SessionStoreName, SessionStoreProps} from '../stores/sessionStore';
import {CommonStyle} from '../utils/CommonStyle';
import {Colors, Padding} from '../utils/Constants';
import {epochToLocalTime} from '../utils/DateUtils';
import {BorderRadius} from '../utils/StyleUtils';
import {notEmptyOrNull} from '../utils/Utils';
import InjectedStripeProps = ReactStripeElements.InjectedStripeProps;

interface Props extends RouteComponentProps, SessionStoreProps {}

interface State {
  width: number;
  height: number;
  password1: string;
  password2: string;
  updatePasswordLoading: boolean;
  updatePasswordError: string;
  playerImage: string;
  updatePlayerImageLoading: boolean;
  updatePlayerImageError: string;
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
  uploadInput: HTMLInputElement;
  saveError: string;
  updatedUser: IUser;
  active: boolean;
  periodEnd: Date;
  card: ICreditCard;
  updatingCard: boolean;
  canceledAt: number;
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
      playerImage: '',
      updatePlayerImageLoading: false,
      updatePlayerImageError: '',
      first: '',
      last: '',
      email: props.sessionStore.authUser.email,
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
      uploadInput: null,
      saveError: '',
      updatedUser: null,
      active: false,
      periodEnd: new Date(),
      card: null,
      updatingCard: false,
      canceledAt: null,
    };

    db.getFirebaseUser(this.props.sessionStore.authUser.uid, snapshot => {
      const user: IUser = snapshot.val() as IUser;

      console.log('user: ' + JSON.stringify(user));

      this.props.sessionStore.setFirebaseUser(user);

      const periodEnd = epochToLocalTime(user.membershipPeriodEnd);

      this.setState(
        {
          first: user.first,
          last: user.last,
          phone: user.phone,
          playerNumber: user.playerNumber,
          position: user.position,
          division: user.division,
          playerImage: user.avatarUrl,
          active: periodEnd >= new Date(),
          periodEnd,
          canceledAt: user.canceledAt,
        },
        () => {
          if (!notEmptyOrNull(this.state.playerImage)) {
            this.getPlayerImage();
          }
        }
      );
    });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);

    const {firebaseUser} = this.props.sessionStore;

    if (firebaseUser) {
      const periodEnd = epochToLocalTime(firebaseUser.membershipPeriodEnd);

      this.setState(
        {
          first: firebaseUser.first,
          last: firebaseUser.last,
          phone: firebaseUser.phone,
          playerNumber: firebaseUser.playerNumber,
          position: firebaseUser.position,
          division: firebaseUser.division,
          playerImage: firebaseUser.avatarUrl,
          active: periodEnd >= new Date(),
          periodEnd,
          card: firebaseUser.card,
          canceledAt: firebaseUser.canceledAt,
        },
        () => {
          if (!notEmptyOrNull(this.state.playerImage)) {
            this.getPlayerImage();
          }
        }
      );
    }
  }

  componentWillUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): void {
    if (nextProps.sessionStore.firebaseUser) {
      const {membershipPeriodEnd, card} = nextProps.sessionStore.firebaseUser;

      if (membershipPeriodEnd) {
        const periodEnd = epochToLocalTime(membershipPeriodEnd);
        if (periodEnd.getTime() !== this.state.periodEnd.getTime()) {
          this.setState({
            active: periodEnd >= new Date(),
            periodEnd,
          });
        }
      }

      if (card && this.state.card !== card && !this.state.updatingCard) {
        this.setState({card});
      }
    }
  }

  getPlayerImage = () => {
    console.log('getPlayerImage');
    getPlayerImageUrl(this.props.sessionStore.authUser.uid, downloadUrl =>
      this.setState({
        playerImage: downloadUrl,
      })
    );
  };

  onInputChange = async () => {
    if (this.state.uploadInput.files[0] !== undefined) {
      console.log('uploadInput: ' + this.state.uploadInput.files[0]);

      await this.setState({
        updatePlayerImageLoading: true,
        updatePlayerImageError: '',
      });

      try {
        const snapshot = await storage
          .ref()
          .child(`avatars/${this.props.sessionStore.authUser.uid}`)
          .put(this.state.uploadInput.files[0]);

        const downloadUrl = await snapshot.ref.getDownloadURL();
        console.log('downloadUrl: ' + downloadUrl);
        this.setState({
          playerImage: downloadUrl,
        });

        db.updateFirebaseUser(this.props.sessionStore.authUser.uid, {avatarUrl: downloadUrl}, e => {
          if (e) {
            this.setState({
              updatePlayerImageError: e.message,
              updatePlayerImageLoading: false,
            });
          } else {
            this.setState({
              updatePlayerImageLoading: false,
            });
          }
        });
      } catch (e) {
        console.error('Error uploading image: ' + e.message);
        this.setState({
          updatePlayerImageError: e.message,
          updatePlayerImageLoading: false,
        });
      }
    }
  };

  updateDimensions = () => {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  };

  byPropKey = (propName: string, value: any) => (): {} => ({
    [propName]: value,
  });

  inputOnChange = (propName: string, event: ChangeEvent<HTMLInputElement>) => {
    if (propName === 'playerNumber' || propName === 'phone') {
      event.target.value = event.target.value.replace(/\D/g, '');
    }

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

  renderPlayerCard = () => {
    return (
      <Fragment>
        <CrisisText
          font={{type: FontType.Header, size: FontSize.XS}}
          style={{
            ...styles.header,
            paddingLeft: '12px',
          }}
        >
          PLAYER CARD
        </CrisisText>
        <Col>
          <PlayerCard
            image={this.state.playerImage}
            first={this.state.first}
            last={this.state.last}
            number={this.state.playerNumber}
            position={this.state.position}
            division={this.state.division}
          />
        </Col>
        <input
          type="file"
          ref={ref => {
            if (this.state.uploadInput === null) {
              this.setState({uploadInput: ref});
            }
          }}
          onChange={this.onInputChange}
          style={{opacity: 0}}
        />
        {this.state.updatePlayerImageError ? (
          <CrisisText className="text-danger" style={styles.error} font={{type: FontType.Paragraph, size: FontSize.S}}>
            {this.state.updatePlayerImageError}
          </CrisisText>
        ) : null}
        <div className="d-flex" style={styles.loadingBtnContainer}>
          {this.state.updatePlayerImageLoading ? (
            <ReactLoading type="balls" color={Colors.primary} />
          ) : (
            <LinkButton style={styles.changeProfilePicButton} onClick={() => this.state.uploadInput.click()}>
              CHANGE PROFILE PICTURE
            </LinkButton>
          )}
        </div>
        {this.state.saveError ? (
          <CrisisText className="text-danger" style={styles.error} font={{type: FontType.Paragraph, size: FontSize.S}}>
            {this.state.saveError}
          </CrisisText>
        ) : null}
        <Row>
          <Col>
            <StrokeButton onClick={(e: ChangeEvent<any>) => this.cancelOnClick(e)} color="secondary">
              CANCEL
            </StrokeButton>
          </Col>
          <Col>
            <StrokeButton onClick={(e: ChangeEvent<any>) => this.saveOnClick(e)} color="primary">
              SAVE
            </StrokeButton>
          </Col>
        </Row>
        <StrokeButton onClick={(e: ChangeEvent<any>) => this.signOutOnClick(e)} color="danger">
          SIGN OUT
        </StrokeButton>
      </Fragment>
    );
  };

  renderPlayerInfoForm = () => {
    const {firebaseUser} = this.props.sessionStore;

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
          maxLength={12}
        />
        <FloatingTextInput
          value={this.state.last}
          onChange={event => this.inputOnChange('last', event)}
          capitalize
          style={styles.inputGroup}
          labelText="LAST"
          maxLength={12}
        />
        <FloatingTextInput
          value={this.state.playerNumber}
          onChange={event => this.inputOnChange('playerNumber', event)}
          style={styles.inputGroup}
          labelText="PLAYER NUMBER"
          maxLength={3}
        />
        <FloatingTextInput
          value={this.state.position}
          onChange={event => this.inputOnChange('position', event)}
          style={styles.inputGroup}
          labelText="POSITION"
          maxLength={12}
        />
        <FloatingTextInput
          value={this.state.division}
          onChange={event => this.inputOnChange('division', event)}
          style={styles.inputGroup}
          labelText="DIVISION"
          maxLength={12}
        />

        <CrisisText font={{type: FontType.Header, size: FontSize.XS}} style={styles.header}>
          CONTACT INFO
        </CrisisText>
        <FloatingTextInput
          value={this.state.email}
          onChange={event => this.inputOnChange('email', event)}
          style={styles.inputGroup}
          labelText="EMAIL"
        />
        <FloatingTextInput
          value={this.state.phone}
          onChange={event => this.inputOnChange('phone', event)}
          capitalize
          style={styles.inputGroup}
          labelText="PHONE"
          maxLength={10}
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
            <ReactLoading type="balls" color={Colors.primary} />
          ) : (
            <Button
              type="submit"
              style={{...styles.button, marginTop: 0}}
              outline
              color="secondary"
              onClick={(e: ChangeEvent<any>) => this.updatePasswordOnClick(e)}
              disabled={disabled}
            >
              UPDATE PASSWORD
            </Button>
          )}
        </div>
      </Form>
    );
  };

  validateInputs = () => {
    if (!notEmptyOrNull(this.state.first)) {
      alert('Firstname cannot be blank!');
      return false;
    }

    if (!notEmptyOrNull(this.state.last)) {
      alert('Lastname cannot be blank!');
      return false;
    }

    if (!notEmptyOrNull(this.state.email)) {
      alert('Email cannot be blank!');
      return false;
    }

    if (!notEmptyOrNull(this.state.phone)) {
      alert('Phone number cannot be blank!');
      return false;
    }

    return true;
  };

  saveOnClick = async (event: ChangeEvent<any>) => {
    if (!this.validateInputs()) {
      return;
    }

    const updatedUser: IUser = {
      first: this.state.first,
      last: this.state.last,
      playerNumber: this.state.playerNumber ? this.state.playerNumber : null,
      position: this.state.position ? this.state.position : null,
      division: this.state.division ? this.state.division : null,
      email: this.state.email,
      phone: this.state.phone,
    };
    this.setState({updatedUser});

    console.log('updatedUser: ' + JSON.stringify(updatedUser));

    db.updateFirebaseUser(this.props.sessionStore.authUser.uid, updatedUser, e => {
      if (e) {
        this.setState({
          saveError: e.message,
        });
      } else {
        alert('User was saved successfully');
      }
    });
  };

  cancelOnClick = async (event: ChangeEvent<any>) => {
    if (window.confirm('Are you sure you wish to cancel? All un-saved changes will be lost for eternity.')) {
      window.location.reload();
    }
  };

  signOutOnClick = async (event: ChangeEvent<any>) => {
    event.preventDefault();

    if (window.confirm('Are you sure you wish to logout? All un-saved changes will be lost for eternity.')) {
      try {
        await auth.doSignOut();
        await this.props.sessionStore.clearSession();
        this.props.history.push(LOGIN_REGISTER);
      } catch (e) {
        console.error(e.message);
      }
    }
  };

  updateCardInfo = () => {
    this.setState({
      card: null,
      updatingCard: true,
    });
  };

  cancelEditCard = (event: ChangeEvent<any>) => {
    this.setState({card: this.props.sessionStore.firebaseUser.card, updatingCard: false});
  };

  doneUpdatingCard = () => {
    this.setState({updatingCard: false});
  };

  removeCard = () => {
    console.log('TODO: Implement remove card feature');
  };

  renderCardInfo = () => {
    return (
      <Fragment>
        <div style={styles.cardContainer}>
          <CrisisText font={{type: FontType.Paragraph, size: FontSize.XS}} style={styles.cardText}>{`${this.state.card.brand} (****${
            this.state.card.last4
          })`}</CrisisText>
          <CrisisText font={{type: FontType.Paragraph, size: FontSize.XS}} style={styles.cardText}>{`Exp. ${
            this.state.card.expMonth
          }/${this.state.card.expYear.toString().substring(2, 4)}`}</CrisisText>
        </div>
        <LinkButton onClick={this.updateCardInfo} textStyle={{color: Colors.white}} style={{marginTop: Padding.V4}}>
          UPDATE CARD INFO
        </LinkButton>
        {/*TODO: Implement Remove Card, not for V1 */}
        {/*<LinkButton onClick={this.removeCard}>REMOVE CARD</LinkButton>*/}
      </Fragment>
    );
  };

  cancelMembership = async () => {
    if (
      window.confirm(
        'Are you sure you wish to PAUSE your membership? You will still be billed at the end of the current membership period, but after that all future payments will be canceled.'
      )
    ) {
      try {
        await this.props.sessionStore.cancelSubscription();
      } catch (err) {
        console.error('Cancel Membership Error: ' + err.message);
        alert('Whoops! Something went wrong while trying to cancel your membership. Please try again in a few moments...');
      }
    }
  };

  resumeMembership = async () => {
    if (window.confirm('RESUME membership? Payments will resume at the end of your normal membership period.')) {
      try {
        await this.props.sessionStore.resumeSubscription();
      } catch (err) {
        console.error('Resume Membership Error: ' + err.message);
        alert('Whoops! Something went wrong while trying to resume your membership. Please try again in a few moments...');
      }
    }
  };

  renderMembershipForm = () => {
    if (!this.props.sessionStore.firebaseUser) {
      return null;
    }

    let membershipPeriodEnd = new Date().getMilliseconds();

    if (this.props.sessionStore.firebaseUser) {
      membershipPeriodEnd = this.props.sessionStore.firebaseUser.membershipPeriodEnd;
    }

    return (
      <Fragment>
        <CrisisText font={{type: FontType.Header, size: FontSize.XS}} style={styles.header}>
          MEMBERSHIP
        </CrisisText>
        <MembershipStatus
          active={this.state.active}
          billedNext={epochToLocalTime(membershipPeriodEnd)}
          onClick={this.state.active ? (this.props.sessionStore.firebaseUser.canceledAt ? this.resumeMembership : this.cancelMembership) : null}
          canceledAt={this.props.sessionStore.firebaseUser ? this.props.sessionStore.firebaseUser.canceledAt : null}
        />
        {this.props.sessionStore.membershipStatusLoading ? (
          <div className="d-flex" style={styles.loadingBtnContainer}>
            <ReactLoading type="balls" color={Colors.primary} />
          </div>
        ) : null}
        <CrisisText font={{type: FontType.Header, size: FontSize.XS}} style={styles.header}>
          PAYMENT
        </CrisisText>
        {this.state.card ? this.renderCardInfo() : <Checkout updatingCard={this.state.updatingCard} onDone={this.doneUpdatingCard} />}
        {this.state.updatingCard ? (
          <StrokeButton onClick={(e: ChangeEvent<any>) => this.cancelEditCard(e)} color="secondary">
            CANCEL
          </StrokeButton>
        ) : null}
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
    color: Colors.gray,
    marginTop: Padding.V,
  },
  loadingBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Padding.H2,
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
  changeProfilePicButton: {
    flex: 1,
    alignSelf: 'center',
  },
  cancelButton: {
    flex: 1,
    alignSelf: 'center',
    marginTop: Padding.H2,
    color: Colors.gray,
  },
  cardContainer: {
    backgroundColor: Colors.beige,
    borderRadius: BorderRadius.M,
    paddingTop: Padding.H2,
    paddingBottom: Padding.H2,
    paddingLeft: Padding.H2,
    paddingRight: Padding.H2,
  },
  cardText: {
    color: Colors.secondary,
  },
};

const authCondition = (authUser: any) => !!authUser;

export default compose(
  withAuthorization(authCondition),
  withRouter,
  inject(SessionStoreName),
  observer
)(Profile as ComponentClass<any>);
