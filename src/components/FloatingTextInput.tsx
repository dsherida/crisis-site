import * as React from 'react';
import {Component, CSSProperties} from 'react';
import {Col, FormGroup, Input, Label, Row} from 'reactstrap';
import CrisisText, {FontSize, FontType, getFontSize} from '../sfc/CrisisText';
import {Colors, Padding} from '../utils/Constants';
import {BorderRadius} from '../utils/StyleUtils';

interface Props {
  style?: CSSProperties | undefined;
  labelText: string;
  secure?: boolean;
}

interface State {
  isFocused: boolean;
}

export default class FloatingTextInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isFocused: false,
    };
  }

  handleFocus = () => this.setState({isFocused: true});
  handleBlur = () => this.setState({isFocused: false});

  render() {
    return (
      <FormGroup style={{...styles.container, ...this.props.style}}>
        <Label for={`${this.props.labelText}`} style={styles.label}>
          <CrisisText font={{type: FontType.Header, size: FontSize.S}} style={styles.labelHeader}>
            {this.props.labelText}
          </CrisisText>
        </Label>
        <input id={`${this.props.labelText}`} style={styles.input} onFocus={this.handleFocus} onBlur={this.handleBlur} />
      </FormGroup>
    );
  }
}

const styles = {
  container: {
    backgroundColor: Colors.Beige,
    borderRadius: BorderRadius.S,
    padding: Padding.H2,
  },
  label: {
    marginBottom: 0,
  },
  labelHeader: {
    color: Colors.Secondary,
    marginBottom: 0,
  },
  input: {
    padding: 0,
    outline: 'none',
    backgroundColor: Colors.Transparent,
    highlight: 0,
    width: '100%',
    borderWidth: 0,
    boxShadow: 'none',
    fontSize: getFontSize(FontSize.M),
    color: Colors.Primary,
  },
};
