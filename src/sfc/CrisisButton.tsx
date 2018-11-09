import {CSSProperties, ReactNode, SFC} from 'react';
import * as React from 'react';
import {Button} from 'reactstrap';
import {Colors} from '../utils/Constants';
import CrisisText, {FontSize, FontType} from './CrisisText';

interface Props {
  onClick: () => void;
  style?: CSSProperties | undefined;
  children?: ReactNode[] | ReactNode | undefined;
  color: string;
}

const CrisisButton: SFC<Props> = props => {
  return (
    <Button outline color={'danger'} style={{...styles.dStyle, ...props.style}} onClick={props.onClick}>
      <CrisisText style={styles.dTextStyle} font={{type: FontType.Header, size: FontSize.M}}>
        {props.children}
      </CrisisText>
    </Button>
  );
};

const styles = {
  dStyle: {
    cursor: 'pointer',
    borderWidth: 0,
    highlight: Colors.Primary,
    outlineColor: Colors.Primary,
    borderColor: Colors.Primary,
  },
  dTextStyle: {
    color: Colors.Gray,
  },
};

export default CrisisButton;
