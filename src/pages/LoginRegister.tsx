import * as React from 'react';
import CrisisText, {FontSize, FontType} from '../sfc/CrisisText';

interface Props {
  id: string;
}

export default class LoginRegister extends React.Component {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.debug}>
        <CrisisText font={{type: FontType.Header, size: FontSize.M}}>Login/Register</CrisisText>
      </div>
    );
  }
}

const styles = {
  debug: {
    borderWidth: 1,
    borderColor: 'red',
  },
};
