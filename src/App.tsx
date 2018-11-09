import * as React from 'react';
import {Col, Container, Row} from 'reactstrap';
import './App.css';
import TopNavBar from './components/TopNavBar';
import CrisisText from './sfc/CrisisText';
import {CommonStyle} from './utils/CommonStyle';
import {Colors} from './utils/Constants';

interface State {
  initialWidth: number;
  initialHeight: number;
  width: number;
  height: number;
}

interface Props {}

export default class App extends React.Component<Props, State> {
  constructor() {
    super(null);

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
        <TopNavBar />
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: Colors.Secondary,
  },
};
