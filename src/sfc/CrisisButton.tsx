import * as React from 'react';
import {CSSProperties, ReactNode, SFC} from 'react';
import {Button} from 'reactstrap';
import {Colors} from '../utils/Constants';
import {FontSize, FontType, getFontSize, getFontTypeStyle} from './CrisisText';

interface Props {
  onClick: () => any;
  style?: CSSProperties | undefined;
  textStyle?: CSSProperties | undefined;
  children?: ReactNode[] | ReactNode | undefined;
  color: string;
}

const CrisisButton: SFC<Props> = props => {
  return (
    <Button outline color={'primary'} style={{...styles.dStyle, ...props.style}} onClick={props.onClick}>
      <h1
        style={{...getFontTypeStyle(FontType.Header), fontSize: getFontSize(FontSize.L), ...styles.dTextStyle, ...props.textStyle}}
        children={props.children}
      />
    </Button>
  );
};

const styles = {
  dStyle: {
    backgroundColor: Colors.Transparent,
    cursor: 'pointer',
    borderWidth: 0,
    boxShadow: 'none',
  },
  dTextStyle: {
    color: Colors.Gray,
  },
};

export default CrisisButton;
