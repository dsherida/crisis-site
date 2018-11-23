import * as React from 'react';
import {ChangeEvent} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {Button} from 'reactstrap';
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

  signOutOnClick = async (event: ChangeEvent<any>) => {
    event.preventDefault();

    try {
      await auth.doSignOut();
      this.props.history.push(LOGIN_REGISTER);
    } catch (e) {
      console.error(e.message);
    }
  };

  render() {
    return (
      <div style={{...CommonStyle.container, width: this.state.width, height: this.state.height}}>
        <CrisisText font={{type: FontType.Header, size: FontSize.M}} style={{color: Colors.Primary}}>
          Dummy
        </CrisisText>
        <SignOutButton onClick={(e: ChangeEvent<any>) => this.signOutOnClick(e)} color="danger" />
      </div>
    );
  }
}

const styles = {};

export default withRouter(Players);
