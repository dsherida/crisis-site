import {AlignSelfProperty, BackgroundPositionProperty, BorderStyleProperty, PositionProperty, TextAlignProperty} from 'csstype';
import * as React from 'react';
import {ReactNode, SFC} from 'react';
import {Col, Row} from 'reactstrap';
import {Colors, Padding} from '../utils/Constants';
import {BorderRadius} from '../utils/StyleUtils';
import CrisisText, {CursiveText, FontSize, FontType} from './CrisisText';

interface Props {
  children?: ReactNode;
  image?: string;
  first?: string;
  last?: string;
  number?: string;
  position?: string;
  division?: string;
}

const PlayerCard: SFC<Props> = props => {
  return (
    <div
      {...props}
      style={{
        ...styles.default,
        backgroundImage: `url(${props.image})`,
        backgroundRepeat: 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/*<img key={props.image} src={`${props.image}#${new Date().getTime()}`} style={{width: '100%', height: '100%'}} />*/}
      <CursiveText style={styles.division} size={FontSize.XS}>
        {props.division}
      </CursiveText>
      <Row className="no-gutters" style={styles.playerInfo}>
        <CursiveText size={FontSize.XL} style={styles.number}>
          {props.number}
        </CursiveText>
        <div style={{width: 1, height: 80, backgroundColor: Colors.Primary, marginLeft: Padding.H2}} />
        <Col style={styles.namewrapper}>
          <CrisisText font={{type: FontType.Header, size: FontSize.M}} style={styles.name}>
            {props.first}
          </CrisisText>
          <CrisisText font={{type: FontType.Header, size: FontSize.M}} style={{...styles.name, ...styles.last}}>
            {props.last}
          </CrisisText>
          <CrisisText font={{type: FontType.Paragraph, size: FontSize.XS}} style={{...styles.position}}>
            {props.position}
          </CrisisText>
        </Col>
      </Row>
    </div>
  );
};

const PLAYER_CARD_HEIGHT = 350;

const styles = {
  default: {
    paddingTop: Padding.H2,
    paddingLeft: Padding.H2,
    backgroundColor: Colors.Black,
    width: '100%',
    height: PLAYER_CARD_HEIGHT,
    ratio: '1:1',
  },
  namewrapper: {
    marginLeft: Padding.H2,
  },
  number: {
    color: Colors.Primary,
  },
  name: {
    color: Colors.Beige,
  },
  last: {
    marginTop: -15,
  },
  position: {
    marginTop: -10,
    color: Colors.White,
  },
  division: {
    color: Colors.Primary,
    backgroundColor: Colors.White,
    borderRadius: BorderRadius.S,
    width: '35%',
    textAlign: 'center' as TextAlignProperty,
  },
  spacer: {
    height: 'auto',
  },
  playerInfo: {
    position: 'absolute' as PositionProperty,
    top: PLAYER_CARD_HEIGHT,
    left: Padding.H2,
  },
};

export default PlayerCard;
