import * as React from 'react';
import {Link, RouteComponentProps, RouteProps, withRouter} from 'react-router-dom';
import {Col, Container, Row} from 'reactstrap';
import {Assets} from '../assets';
import {RouteNames} from '../Main';
import CrisisButton from '../sfc/CrisisButton';
import {Colors} from '../utils/Constants';

interface Props extends RouteComponentProps<void> {}

interface State {
  currentRoute: string;
}

class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {pathname} = props.location;

    this.state = {
      currentRoute: pathname,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const {pathname} = nextProps.location;

    this.setState({
      currentRoute: pathname,
    });
  }

  playersOnClick = () => {
    console.log('playersOnClick');
  };

  loginRegisterOnClick = () => {
    console.log('loginRegisterOnClick');
  };

  isPlayersRoute = () => {
    return this.state.currentRoute === RouteNames.Players || this.state.currentRoute === RouteNames.Home;
  };

  isLoginRegisterRoute = () => {
    return this.state.currentRoute === RouteNames.LoginRegister;
  };

  render() {
    return (
      <div style={styles.container}>
        <Container>
          <Row>
            <Col className="d-flex justify-content-center align-items-center">
              <Link to={'/players'}>
                <CrisisButton
                  color={Colors.Primary}
                  textStyle={this.isPlayersRoute() ? styles.activeLink : styles.navLink}
                  onClick={this.playersOnClick}
                >
                  PLAYERS
                </CrisisButton>
              </Link>
            </Col>
            <Col className="d-flex" style={styles.imageRow}>
              <img style={{position: 'absolute'}} src={Assets.src.crisis_logo} />
            </Col>
            <Col className="d-flex justify-content-center align-items-center">
              <Link to={'/login-register'}>
                <CrisisButton
                  color={Colors.Primary}
                  textStyle={this.isLoginRegisterRoute() ? styles.activeLink : styles.navLink}
                  onClick={this.loginRegisterOnClick}
                >
                  LOGIN/REGISTER
                </CrisisButton>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export const HeaderHeight = 200;

const styles = {
  container: {
    width: '100%',
    height: '100%',
    background: `linear-gradient(to bottom, ${Colors.SecondaryDark} 0%, ${Colors.PrimaryTransparent} 50%, ${Colors.SecondaryDark} 100%)`,
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
    color: Colors.Primary,
  },
};

export default withRouter(props => <Header {...props} />) as React.ComponentClass<{}>;
