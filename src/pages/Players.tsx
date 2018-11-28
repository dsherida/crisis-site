import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Fragment} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {Container} from 'reactstrap';
import {compose} from 'recompose';
import {HeaderHeight} from '../components/Header';
import {db} from '../firebase/index';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import {UserStoreProps} from '../stores/userStore';
import {CommonStyle} from '../utils/CommonStyle';
import {Colors, Padding} from '../utils/Constants';

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

      // this.setState({
      //   users: snapshot.val(),
      // });
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

  renderPlayers = (users: any) => {
    return (
      <Fragment>
        {Object.keys(users).map(key => (
          <CrisisText key={key} font={{size: FontSize.S, type: FontType.Paragraph}}>
            {users[key].first}
          </CrisisText>
        ))}
      </Fragment>
    );
  };

  render() {
    const {users} = this.props.userStore;

    return (
      <div style={{...CommonStyle.container, ...styles.container, width: this.state.width, height: this.state.height}}>
        <Container>
          <div style={styles.playerCardContainer} />
          {!!users && this.renderPlayers(users)}
        </Container>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: Padding.V,
  },
  playerCardContainer: {
    height: 200,
    width: 200,
    backgroundColor: Colors.Primary,
  },
};

export default compose(
  inject('userStore'),
  observer
)(withRouter(Players));
