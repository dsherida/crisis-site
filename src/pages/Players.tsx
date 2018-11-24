import * as React from 'react';
import {ChangeEvent} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {Button, Container} from 'reactstrap';
import {HeaderHeight} from '../components/Header';
import {LOGIN_REGISTER} from '../constants/routes';
import {auth} from '../firebase';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import SignOutButton from '../sfc/SignOutButton';
import {CommonStyle} from '../utils/CommonStyle';
import {Colors, Padding} from '../utils/Constants';

interface State {
  width: number;
  height: number;
}

interface Props extends RouteComponentProps {}

class Players extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    this.setState({width: window.innerWidth, height: window.innerHeight - HeaderHeight});
  }

  render() {
    return (
      <div style={{...CommonStyle.container, ...styles.container, width: this.state.width, height: this.state.height}}>
        <Container>
          <div style={styles.playerCardContainer} />
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

export default withRouter(Players);
