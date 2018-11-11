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
  className?: string;
  font: Font;
  children?: ReactNode;
  style?: CSSProperties | undefined;
}

export const getFontTypeStyle = (type: FontType) => {
  switch (type) {
    case FontType.Header:
      return headerStyles.default;
    case FontType.Paragraph:
      return styles.default;
  }
};

export const getFontSize = (size: FontSize) => {
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

const CrisisText: SFC<Props> = props => {
  return (
    <h1 {...props} style={{...getFontTypeStyle(props.font.type), fontSize: getFontSize(props.font.size), ...props.style}}>
      {props.children}
    </h1>
  );
};

const headerStyles = {
  default: {
    fontFamily: 'Righteous',
    fontWeight: 400,
  },
};

const styles = {
  default: {
    fontFamily: 'sans-serif',
    color: Colors.White,
  },
};

export default CrisisText;
