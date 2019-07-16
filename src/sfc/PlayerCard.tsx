import {
  AlignSelfProperty,
  BackgroundPositionProperty,
  BorderStyleProperty,
  PositionProperty,
  ResizeProperty,
  TextAlignProperty,
} from 'csstype';
import * as React from 'react';
import {ReactNode, SFC} from 'react';
import {Col, Row} from 'reactstrap';
import {Assets} from '../assets';
import {Colors, Padding} from '../utils/Constants';
import {BorderRadius, crisisGlow} from '../utils/StyleUtils';
import CrisisText, {CursiveText, FontSize, FontType} from './CrisisText';
import {ExifOrientation} from '../models/User';
import {BrowserView, isBrowser} from 'react-device-detect';
import POSITIONS from '../constants/positions';

interface Props {
  children?: ReactNode;
  imageOrientation?: ExifOrientation;
  image?: string;
  first?: string;
  last?: string;
  number?: string;
  position?: string;
  division?: string;
}

export const DIVISIONS_SHORT = ['Unranked', 'D5', 'D4', 'D3', 'D2', 'D1', 'Semi-Pro', 'Pro'];
export const DIVISIONS = ['Unranked', 'Division 5', 'Division 4', 'Division 3', 'Division 2', 'Division 1', 'Semi-Pro', 'Pro'];

const transformDivision = (division: string) => {
  switch (division.toLowerCase()) {
    default:
      return division.toLocaleUpperCase();
    case DIVISIONS_SHORT[1].toLowerCase():
      return DIVISIONS[1];
    case DIVISIONS_SHORT[2].toLowerCase():
      return DIVISIONS[2];
    case DIVISIONS_SHORT[3].toLowerCase():
      return DIVISIONS[3];
    case DIVISIONS_SHORT[4].toLowerCase():
      return DIVISIONS[4];
    case DIVISIONS_SHORT[5].toLowerCase():
      return DIVISIONS[5];
    case DIVISIONS_SHORT[6].toLowerCase():
      return DIVISIONS[6];
    case DIVISIONS_SHORT[7].toLowerCase():
      return DIVISIONS[7];
  }
};

const transformPosition = (position: string) => {
  switch (position.toLowerCase()) {
    default:
      return position;
    case POSITIONS[1].toLowerCase():
      return POSITIONS[1];
    case POSITIONS[2].toLowerCase():
      return POSITIONS[2];
    case POSITIONS[3].toLowerCase():
      return POSITIONS[3];
    case POSITIONS[4].toLowerCase():
      return POSITIONS[4];
    case POSITIONS[5].toLowerCase():
      return POSITIONS[5];
    case POSITIONS[6].toLowerCase():
      return POSITIONS[6];
  }
};

const PlayerCard: SFC<Props> = (props: Props) => {
  return (
    <div
      {...props}
      style={{
        ...styles.default,
        // backgroundImage: props.image ? `url(${props.image})` : `url(${Assets.src.avatar})`,
        backgroundRepeat: 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      <img
        src={props.image ? props.image : Assets.src.avatar}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: BORDER_RADIUS,
          objectFit: 'cover',
          transform: isBrowser ? `rotate(${props.imageOrientation ? props.imageOrientation.rotate : 0}deg)` : null,
        }}
      />
      <div
        style={{
          marginLeft: 15,
          marginRight: 15,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.85,
          borderRadius: BORDER_RADIUS,
          background: `linear-gradient(to bottom, ${Colors.primaryLightTransparent} 67%, ${Colors.black} 100%)`,
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
        <CrisisText style={styles.division} font={{type: FontType.Paragraph, size: FontSize.XS}}>
          {props.division ? transformDivision(props.division).toLocaleUpperCase() : 'UNRANKED'}
        </CrisisText>
        <Row className="no-gutters" style={styles.playerInfo}>
          <CursiveText size={FontSize.XL} style={styles.number}>
            {props.number ? props.number : '00'}
          </CursiveText>
          <div style={{width: '2px', height: '80px', backgroundColor: Colors.primary, marginLeft: Padding.H2}}/>
          <Col style={styles.namewrapper}>
            <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={styles.name}>
              {props.first ? props.first : 'XXX'}
            </CrisisText>
            <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={{...styles.name, ...styles.last}}>
              {props.last ? props.last : 'XXX'}
            </CrisisText>
            <CrisisText font={{type: FontType.Paragraph, size: FontSize.XS}} style={{...styles.position}}>
              {props.position ? transformPosition(props.position) : 'All-Around'}
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
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.black,
    // width: PLAYER_CARD_HEIGHT,
    height: PLAYER_CARD_HEIGHT,
    borderRadius: BORDER_RADIUS,
  },
  namewrapper: {
    marginLeft: Padding.H2,
  },
  number: {
    color: Colors.primary,
    textShadow: '2px 2px #000000',
  },
  name: {
    color: Colors.beige,
    textShadow: '0px 0px 7px #000000',
  },
  last: {
    marginTop: -15,
  },
  position: {
    marginTop: -5,
    color: Colors.white,
  },
  division: {
    marginTop: Padding.H2,
    marginLeft: Padding.H2,
    color: Colors.black,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.S,
    width: '35%',
    textAlign: 'center' as TextAlignProperty,
    paddingTop: (Padding.H2 / 3) + 2,
    paddingBottom: Padding.H2 / 3,
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
