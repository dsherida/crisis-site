import * as React from 'react';
import {CSSProperties, ReactNode, SFC} from 'react';
import {Button} from 'reactstrap';
import {Colors} from '../utils/Constants';
import {FontSize, FontType, getFontSize, getFontTypeStyle} from './CrisisText';

interface Props {
  onClick: () => void;
  style?: CSSProperties | undefined;
  textStyle?: CSSProperties | undefined;
  children?: ReactNode[] | ReactNode | undefined;
  color: string;
}

const CrisisButton: SFC<Props> = props => {
  return (
    <Button outline color={'danger'} style={{...styles.dStyle, ...props.style}} onClick={props.onClick}>
      <h1
        style={{...getFontTypeStyle(FontType.Header), fontSize: getFontSize(FontSize.M), ...styles.dTextStyle, ...props.textStyle}}
        children={props.children}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  dTextStyle: {
    color: Colors.Gray,
  },
};

export default CrisisButton;
