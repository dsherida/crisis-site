import {TextAlignProperty} from 'csstype';
import * as React from 'react';
import {ReactNode, SFC} from 'react';
import {CSSProperties} from 'react';
import {Button} from 'reactstrap';
import {Colors} from '../utils/Constants';
import CrisisText, {FontSize, FontType} from './CrisisText';

interface Props {
  children?: ReactNode;
  style?: CSSProperties | undefined;
  onClick: () => void;
  textStyle?: CSSProperties | undefined;
}

const LinkButton: SFC<Props> = props => {
  return (
    <Button {...props} onClick={props.onClick} style={{...styles.default, ...props.style}}>
      <CrisisText style={{...styles.text, ...props.textStyle}} font={{type: FontType.Paragraph, size: FontSize.XS}}>
        {props.children}
      </CrisisText>
    </Button>
  );
};

const styles = {
  default: {
    width: '100%',
    backgroundColor: Colors.Transparent,
    cursor: 'pointer',
    borderWidth: 0,
    boxShadow: 'none',
  },
  text: {
    color: Colors.Primary,
    textDecorationLine: 'underline',
    textAlign: 'center' as TextAlignProperty,
  },
};

export default LinkButton;
