import {ChangeEvent, ReactNode, SFC} from 'react';
import * as React from 'react';
import {Button} from 'reactstrap';
import {Padding} from '../utils/Constants';

interface Props {
  onClick: (e: ChangeEvent<any>) => void;
  color?: 'primary' | 'danger' | 'secondary' | undefined;
  children?: ReactNode[] | ReactNode | undefined;
}

const StrokeButton: SFC<Props> = (props: Props) => {
  return (
    <Button style={styles.button} outline color={props.color ? props.color : 'primary'} onClick={props.onClick}>
      {props.children}
    </Button>
  );
};

const styles = {
  button: {
    marginTop: Padding.H2,
    paddingTop: Padding.H2,
    paddingBottom: Padding.H2,
    width: '100%',
  },
};

export default StrokeButton;
