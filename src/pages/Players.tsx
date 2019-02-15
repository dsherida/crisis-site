import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Fragment, ReactNode} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {Col, Container, Row} from 'reactstrap';
import {compose} from 'recompose';
import {Assets} from '../assets';
import {HeaderHeight} from '../components/Header';
import {db} from '../firebase/index';
import {IUser} from '../models/User';
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
      console.log('players: ' + JSON.stringify(snapshot.val()));
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
          <Col className="col-4" style={styles.playerCardCol}>
            <PlayerCard
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
        <Container>
          <Row>{!!users && this.renderPlayers()}</Row>
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
  playerCardCol: {
    marginTop: Padding.V,
  },
};

export default compose(
  inject('userStore'),
  observer
)(withRouter(Players));
