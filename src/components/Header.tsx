import {AlignSelfProperty, VerticalAlignProperty} from 'csstype';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Fragment} from 'react';
import {Link, RouteProps, withRouter} from 'react-router-dom';
import {Col, Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Row} from 'reactstrap';
import {compose} from 'recompose';
import {Assets} from '../assets';
import {HOME, LOGIN_REGISTER, PLAYERS, PROFILE} from '../constants/routes';
import BootstrapSizeClassHelper from '../sfc/BootstrapSizeClassHelper';
import CrisisButton from '../sfc/CrisisButton';
import {SessionStoreName, SessionStoreProps} from '../stores/sessionStore';
import {Colors} from '../utils/Constants';
import {crisisGlow} from '../utils/StyleUtils';

interface Props extends RouteProps, SessionStoreProps {}

interface State {
  currentRoute: string;
  width: number;
  height: number;
  isOpen: boolean;
}

class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {pathname} = props.location;

    this.state = {
      currentRoute: pathname,
      width: 0,
      height: 0,
      isOpen: false,
    };
  }

  componentDidMount(): void {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  componentWillReceiveProps(nextProps: Props) {
    const {pathname} = nextProps.location;

    this.setState({
      currentRoute: pathname,
    });
  }

  playersOnClick = () => {};

  loginRegisterOnClick = () => {};

  isPlayersRoute = () => {
    return this.state.currentRoute === PLAYERS || this.state.currentRoute === HOME;
  };

  isLoginRegisterRoute = () => {
    return this.state.currentRoute === LOGIN_REGISTER;
  };

  isProfileRoute = () => {
    return this.state.currentRoute === PROFILE;
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  navigationAuth = () => {
    return (
      <Fragment>
        <Col className="d-flex justify-content-center align-items-center">
          <Link to={PLAYERS}>
            <CrisisButton color={Colors.primary} textStyle={this.isPlayersRoute() ? styles.activeLink : styles.navLink} onClick={this.playersOnClick}>
              PLAYERS
            </CrisisButton>
          </Link>
        </Col>
        <Col className="d-flex justify-content-center align-items-center">
          <Link to={PROFILE}>
            <CrisisButton
              color={Colors.primary}
              textStyle={this.isProfileRoute() ? styles.activeLink : styles.navLink}
              onClick={this.loginRegisterOnClick}
            >
              PROFILE
            </CrisisButton>
          </Link>
        </Col>
      </Fragment>
    );
  };

  navigationNonAuth = () => {
    return (
      <Fragment>
        <Col className="d-flex justify-content-center align-items-center">
          <Link to={PLAYERS}>
            <CrisisButton color={Colors.primary} textStyle={this.isPlayersRoute() ? styles.activeLink : styles.navLink} onClick={this.playersOnClick}>
              PLAYERS
            </CrisisButton>
          </Link>
        </Col>
        <Col className="d-flex justify-content-center align-items-center">
          <Link to={LOGIN_REGISTER}>
            <CrisisButton
              color={Colors.primary}
              textStyle={this.isLoginRegisterRoute() ? styles.activeLink : styles.navLink}
              onClick={this.loginRegisterOnClick}
            >
              LOGIN/REGISTER
            </CrisisButton>
          </Link>
        </Col>
      </Fragment>
    );
  };

  navigation = () => {
    const {authUser} = this.props.sessionStore;

    return <Fragment>{authUser ? this.navigationAuth() : this.navigationNonAuth()}</Fragment>;
  };

  render() {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{...styles.container, height: this.state.height / 2}}>
        <BootstrapSizeClassHelper width={this.state.width} />
        <Container>
          <Row className="justify-content-center">
            <img style={{height: this.state.height / 3}} src={Assets.src.crisis_logo} />
          </Row>
          <Row>{this.navigation()}</Row>
        </Container>
      </div>
    );
  }
}

export const HeaderHeight = 200;

const styles = {
  container: {
    background: `linear-gradient(to bottom, ${Colors.secondaryDark} 0%, ${Colors.primaryTransparent} 50%, ${Colors.secondaryDark} 100%)`,
  },
  imageRow: {
    justifyContent: 'center',
    height: HeaderHeight,
  },
  main: {
    bottom: 0,
  },
  navLink: {},
  activeLink: {
    color: Colors.primary,
  },
};

export default compose(
  withRouter,
  inject(SessionStoreName),
  observer
)(Header);
