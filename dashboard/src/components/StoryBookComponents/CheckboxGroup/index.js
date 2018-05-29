import React, {PureComponent} from 'react';
import {Checkbox} from 'antd';
import './CheckboxGroup.scss';
import {PropTypes} from 'prop-types';

export default class CheckboxGroup extends PureComponent {
  static propTypes = {
    /** get data of checkbox group when click */
    onChangeHandle: PropTypes.func.isRequired,
    /** checked value of is field  - 'approved'  => accept checkbox check, 'rejected' => reject checkbox check , null*/
    checked: PropTypes.string,
    /** disabled value  :status of disabled*/
    disabled: PropTypes.bool
  };
  state = {
    checked: 'approved',
    disabled: false
  };

  componentWillMount() {
    this.setState({checked: this.props.checked});
  }
  onChange = (type) => (evt) => this.setState({
    checked: type
  }, () => this.props.onChangeHandle(this.state.checked));

  componentWillReceiveProps(nextProps) {
    this.setState({checked: nextProps.checked})
  }

  render() {
    return (
      <div className="checkbox-group__wrapper">
        <div className="checkbox-group accept">
          <Checkbox
            checked={this.state.checked === 'approved'}
            disabled={this.props.disabled}
            onChange={this.onChange('approved')}/>
        </div>
        <div className="checkbox-group reject">
          <Checkbox
            checked={this.state.checked === 'rejected'}
            disabled={this.props.disabled}
            onChange={this.onChange('rejected')}/>
        </div>
      </div>
    );
  }
}
