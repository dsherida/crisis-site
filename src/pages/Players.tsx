import * as React from 'react';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import {CommonStyle} from '../utils/CommonStyle';
import {HeaderHeight} from '../components/Header';

interface State {
  width: number;
  height: number;
}

interface Props {}

export default class Players extends React.Component<Props, State> {
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
      <div style={{...CommonStyle.container, width: this.state.width, height: this.state.height}}>
        <CrisisText font={{type: FontType.Header, size: FontSize.M}}>Players</CrisisText>
      </div>
    );
  }
}

const styles = {};
