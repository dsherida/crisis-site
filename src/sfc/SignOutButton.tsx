import {ChangeEvent, SFC} from 'react';
import * as React from 'react';
import {Button} from 'reactstrap';
import {Padding} from '../utils/Constants';

interface Props {
  onClick: (e: ChangeEvent<any>) => void;
  color?: 'primary' | 'danger' | undefined;
}

const SignOutButton: SFC<Props> = (props: Props) => {
  return (
    <Button style={styles.button} outline color={props.color ? props.color : 'primary'} onClick={props.onClick}>
      SIGN OUT
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

export default SignOutButton;
