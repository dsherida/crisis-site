import * as React from 'react';
import TopNavBar from '../components/TopNavBar';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';
import {Colors} from '../utils/Constants';

interface State {
  initialWidth: number;
  initialHeight: number;
  width: number;
  height: number;
}

interface Props {}

export default class Players extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      width: 800,
      height: 182,
      initialWidth: 800,
      initialHeight: 182,
    };
  }

  componentDidMount() {
    this.updateDimensions();
    this.setInitialDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  };

  setInitialDimensions = () => {
    this.setState({
      initialHeight: window.innerHeight,
      initialWidth: window.innerWidth,
    });
  };

  render() {
    return (
      <div style={styles.container}>
        <CrisisText font={{type: FontType.Header, size: FontSize.M}}>Players</CrisisText>
      </div>
    );
  }
}

const styles = {
  container: {
  },
};
