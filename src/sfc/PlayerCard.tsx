import {AlignSelfProperty, PositionProperty, TextAlignProperty} from 'csstype';
import * as React from 'react';
import {ReactNode, SFC} from 'react';
import {Col, Row} from 'reactstrap';
import {Colors} from '../utils/Constants';
import {BorderRadius} from '../utils/StyleUtils';
import CrisisText, {FontSize, FontType} from './CrisisText';

interface Props {
  children?: ReactNode;
  first?: string;
  last?: string;
  number?: string;
  position?: string;
  division?: string;
}

const PlayerCard: SFC<Props> = props => {
  return (
    <div {...props} style={styles.default}>
      <CrisisText style={styles.division} font={{type: FontType.Paragraph, size: FontSize.S}}>
        {props.division}
      </CrisisText>
      <Row className="d-flex no-gutters align-bottom" style={styles.playerInfo}>
        <CrisisText font={{type: FontType.Header, size: FontSize.XL}} style={styles.name}>
          {props.number}
        </CrisisText>
        <Col>
          <CrisisText font={{type: FontType.Header, size: FontSize.L}} style={styles.name}>
            {props.first}
          </CrisisText>
          <CrisisText font={{type: FontType.Header, size: FontSize.L}} style={{...styles.name, ...styles.last}}>
            {props.last}
          </CrisisText>
          <CrisisText font={{type: FontType.Paragraph, size: FontSize.S}} style={{...styles.name, ...styles.last}}>
            {props.position}
          </CrisisText>
        </Col>
      </Row>
    </div>
  );
};

const styles = {
  default: {
    backgroundColor: Colors.Black,
    width: '100%',
    height: 350,
    ratio: '1:1',
    aspectRatio: 1,
  },
  name: {
    color: Colors.Beige,
  },
  last: {
    marginTop: -15,
  },
  division: {
    color: Colors.Primary,
    backgroundColor: Colors.White,
    borderRadius: BorderRadius.S,
    width: '33%',
    textAlign: 'center' as TextAlignProperty,
  },
  playerInfo: {
    backgroundColor: Colors.Gray,
    alignSelf: 'bottom' as AlignSelfProperty,
  },
  playerInfoRow: {
    backgroundColor: Colors.Primary,
  },
};

export default PlayerCard;
