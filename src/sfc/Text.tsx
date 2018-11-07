import * as React from 'react';
import {CSSProperties, ReactNode, SFC} from 'react';
import {Colors} from '../utils/Constants';

export enum FontType {
  Header = 'Header',
  Paragraph = 'Paragraph',
}

export enum FontSize {
  S = 'S',
  M = 'M',
  L = 'L',
}

export interface Font {
  type: FontType;
  size: FontSize;
}

interface Props {
  font: Font;
  children?: ReactNode;
  style?: CSSProperties | undefined;
}

const getFontType = (type: FontType) => {
  switch (type) {
    case FontType.Header:
      break;
    case FontType.Paragraph:
      break;
  }
};

const getFontSize = (size: FontSize) => {
  switch (size) {
    default:
    case FontSize.S:
      return 22;
    case FontSize.M:
      return 26;
    case FontSize.L:
      return 34;
  }
};

const Text: SFC<Props> = props => {
  return (
    <a {...props} style={{...styles.default, ...props.style, fontSize: getFontSize(props.font.size)}}>
      {props.children}
    </a>
  );
};

const styles = {
  default: {
    color: Colors.White,
  },
};

export default Text;
