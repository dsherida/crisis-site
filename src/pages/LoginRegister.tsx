import * as React from 'react';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import {HeaderHeight} from '../components/Header';
import {CommonStyle} from '../utils/CommonStyle';

interface Props {
  id: string;
}

interface State {
  width: number;
  height: number;
}

export default class LoginRegister extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    this.updateDimensions();
    // window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({width: window.innerWidth, height: window.innerHeight - HeaderHeight});
  };

  render() {
    return (
      <div style={{...CommonStyle.container, width: this.state.width, height: this.state.height}}>
        <CrisisText font={{type: FontType.Header, size: FontSize.M}}>Login/Register</CrisisText>
      </div>
    );
  }
}

const styles = {};
