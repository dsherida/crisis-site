import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {Button, Col, Container, Row} from 'reactstrap';
import {compose} from 'recompose';
import {Assets} from '../assets';
import {HeaderHeight} from '../components/Header';
import {db} from '../firebase/index';
import CrisisButton from '../sfc/CrisisButton';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import PlayerCard from '../sfc/PlayerCard';
import {UserStoreProps} from '../stores/userStore';
import {CommonStyle} from '../utils/CommonStyle';
import {Colors, Padding} from '../utils/Constants';
import {epochToLocalTime} from '../utils/DateUtils';

interface State {
  width: number;
  height: number;
  users: {};
  playersError: string;
}

interface Props extends RouteComponentProps, UserStoreProps {}

class Players extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      users: {},
      playersError: '',
    };
  }

  async componentDidMount() {
    const {userStore} = this.props;

    try {
      const snapshot = await db.onceGetUsers();
      userStore.setUsers(snapshot.val());
    } catch (e) {
      console.error(e.message);
      this.setState({
        playersError: e.message,
      });
    }

    this.setState({
      width: window.innerWidth,
      height: window.innerHeight - HeaderHeight,
    });
  }

  renderPlayers = () => {
    const {users} = this.props.userStore;

    return Object.keys(users).map((key: any) => {
      const user = users[key];

      if (epochToLocalTime(user.membershipPeriodEnd) >= new Date()) {
        return (
          <Col xs={12} sm={6} xl={4} style={styles.playerCardCol}>
            <PlayerCard
              imageOrientation={user.avatarOrientation}
              image={user.avatarUrl}
              first={user.first}
              last={user.last}
              division={user.division}
              position={user.position}
              number={user.playerNumber}
            />
          </Col>
        );
      } else {
        return null;
      }
    });
  };

  render() {
    const {users} = this.props.userStore;

    return (
      <div style={{...CommonStyle.container, ...styles.container, minHeight: this.state.height}}>
        <div
          className="d-flex flex-column"
          style={{
            backgroundImage: `url(${Assets.src.hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: this.state.height,
            borderTop: '2px solid white',
            borderBottom: '2px solid white',
          }}
        >
          <CrisisText
            font={{size: FontSize.L, type: FontType.Header}}
            style={{color: Colors.white, textAlign: 'center', textShadow: '0px 0px 26px #000000', width: '67%', opacity: 0.95}}
          >
            IF YOU DON'T PRACTICE, YOU DON'T DESERVE TO WIN
          </CrisisText>
          <CrisisText
            font={{size: FontSize.XS, type: FontType.Paragraph}}
            style={{color: Colors.white, textAlign: 'center', textShadow: '0px 0px 4px #000000', width: '67%'}}
          >
            Now hosting tryouts for Division 4 and Division 5 speedball players!
          </CrisisText>
          <Button
            onClick={() => (window.location.href = `mailto:copperstatecrisis@gmail.com?subject=New Inquiry from CrisisPaintball.com`)}
            color="primary"
            style={{marginTop: Padding.H}}
          >
            SEND US A MESSAGE
          </Button>
        </div>
        <Row
          className="d-flex"
          style={{
            padding: Padding.V2,
            backgroundColor: Colors.white,
            justifyContent: 'space-around',
            borderTop: `8px solid ${Colors.primary}`,
            borderBottom: `8px solid ${Colors.primary}`,
          }}
        >
          <a href="https://virtuepb.com/" target="_blank">
            <img src={Assets.src.sponsors.virtue} height={SPONSOR_SIZE} width={SPONSOR_SIZE} />
          </a>
          <a href="https://www.bunkerkings.com/" target="_blank">
            <img src={Assets.src.sponsors.bunkerkings} height={SPONSOR_SIZE} width={SPONSOR_SIZE} />
          </a>
          <a href="https://planeteclipse.com/" target="_blank">
            <img src={Assets.src.sponsors.eclipse} height={SPONSOR_SIZE} width={SPONSOR_SIZE} />
          </a>
          <a href="http://www.style-supply.de/" target="_blank">
            <img src={Assets.src.sponsors.stylesupply} height={SPONSOR_SIZE} width={SPONSOR_SIZE} />
          </a>
          <a href="https://axctactical.com" target="_blank">
            <img src={Assets.src.sponsors.mesapaintball} height={SPONSOR_SIZE} width={SPONSOR_SIZE} />
          </a>
        </Row>
        <Container>
          <Row>{!!users && this.renderPlayers()}</Row>
        </Container>
      </div>
    );
  }
}

const SPONSOR_SIZE = 125;

const styles = {
  container: {
    width: '100%',
    paddingBottom: Padding.V,
  },
  playerCardCol: {
    marginTop: Padding.V,
  },
};

export default compose(
  inject('userStore'),
  observer
)(withRouter(Players));
