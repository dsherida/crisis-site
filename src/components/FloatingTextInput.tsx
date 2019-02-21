import {TextTransformProperty} from 'csstype';
import * as React from 'react';
import {ChangeEvent, Component, CSSProperties} from 'react';
import {Col, FormGroup, Input, Label, Row} from 'reactstrap';
import CrisisText, {FontSize, FontType, getFontSize, paragraphStyles} from '../sfc/CrisisText';
import {Colors, Padding} from '../utils/Constants';
import {BorderRadius} from '../utils/StyleUtils';

interface Props {
  style?: CSSProperties | undefined;
  labelText: string;
  secure?: boolean;
  capitalize?: boolean;
  value: string;
  maxLength?: number;
  autoComplete?: "on" | "off";
  autoCorrect?: "on" | "off";
  autoCapitalize?: "on" | "off";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
          <CrisisText font={{type: FontType.Header, size: FontSize.XS}} style={styles.labelHeader}>
            {this.props.labelText}
          </CrisisText>
        </Label>
        <input
          autoComplete={this.props.autoComplete}
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          maxLength={this.props.maxLength}
          type={this.props.secure ? 'password' : null}
          id={`${this.props.labelText}`}
          style={{...paragraphStyles.default, ...styles.input, textTransform: this.props.capitalize ? ('capitalize' as TextTransformProperty) : null}}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.props.onChange}
          value={this.props.value}
        />
      </FormGroup>
    );
  }
}

const styles = {
  container: {
    backgroundColor: Colors.beige,
    borderRadius: BorderRadius.S,
  },
  label: {
    marginBottom: 0,
    marginLeft: Padding.H2,
  },
  labelHeader: {
    color: Colors.secondary,
    marginBottom: 0,
  },
  input: {
    paddingLeft: Padding.H2,
    paddingRight: Padding.H2,
    outline: 'none',
    backgroundColor: Colors.transparent,
    highlight: 0,
    width: '100%',
    borderWidth: 0,
    boxShadow: 'none',
    fontSize: getFontSize(FontSize.M),
    color: Colors.primary,
  },
};
