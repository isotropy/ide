import React from 'react';
import Switch from 'codesandbox/app/components/Switch';

type Props = {
  value: boolean,
  setValue: boolean => any,
};

export default class PreferenceSwitch extends React.PureComponent {
  props: Props;
  handleClick = () => {
    this.props.setValue(!this.props.value);
  };

  render() {
    const { value } = this.props;
    return (
      <Switch
        onClick={this.handleClick}
        small
        style={{ width: '3rem' }}
        offMode
        secondary
        right={value}
      />
    );
  }
}
