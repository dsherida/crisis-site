import {AlignSelfProperty, BackgroundPositionProperty, BorderStyleProperty, PositionProperty, TextAlignProperty} from 'csstype';
import * as React from 'react';
import {ReactNode, SFC} from 'react';
import {Col, Row} from 'reactstrap';
import {Assets} from '../assets';
import {Colors, Padding} from '../utils/Constants';
import {BorderRadius, crisisGlow} from '../utils/StyleUtils';
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
        backgroundImage: props.image ? `url(${props.image})` : `url(${Assets.src.avatar})`,
        backgroundRepeat: 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          height: PLAYER_CARD_HEIGHT,
          width: PLAYER_CARD_HEIGHT,
          opacity: 0.34,
          borderRadius: BORDER_RADIUS,
          background: `linear-gradient(to bottom, ${Colors.Primary} 0%, ${Colors.Secondary} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          paddingLeft: Padding.H2,
        }}
      >
        <CursiveText style={styles.division} size={FontSize.XS}>
          {props.division ? props.division : 'Unranked'}
        </CursiveText>
        <Row className="no-gutters" style={styles.playerInfo}>
          <CursiveText size={FontSize.XL} style={styles.number}>
            {props.number ? props.number : '00'}
          </CursiveText>
          <div style={{width: '2px', height: '80px', backgroundColor: Colors.Primary, marginLeft: Padding.H2}} />
          <Col style={styles.namewrapper}>
            <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={styles.name}>
              {props.first ? props.first : 'XXX'}
            </CrisisText>
            <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={{...styles.name, ...styles.last}}>
              {props.last ? props.last : 'XXX'}
            </CrisisText>
            <CrisisText font={{type: FontType.Paragraph, size: FontSize.XS}} style={{...styles.position}}>
              {props.position ? props.position : 'All Around'}
            </CrisisText>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const PLAYER_CARD_HEIGHT = 350;
const BORDER_RADIUS = BorderRadius.M;

const styles = {
  default: {
    boxShadow: crisisGlow(),
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: Colors.PrimaryDark,
    backgroundColor: Colors.Black,
    width: PLAYER_CARD_HEIGHT,
    height: PLAYER_CARD_HEIGHT,
    borderRadius: BORDER_RADIUS,
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
    marginTop: Padding.H2,
    marginLeft: Padding.H2,
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
    marginTop: PLAYER_CARD_HEIGHT / 1.7,
    marginLeft: Padding.H2,
  },
};

export default PlayerCard;
