import React, {PureComponent} from 'react';
import {Icon, Input} from 'antd';
import {debounce} from 'lodash'

export default class KYCListUsernameSearch extends PureComponent {
  state = {
    value: ''
  }

  /**
 * get input value from user and update filter
 *
 * @param  {string} value input value when user typing
 *
 */

  _getValueAndUpdate = (value) => {
    this.setState({
      value
    }, () => this.props.onChange(this.state.value))
  }

  render() {
    const getValueAndUpdate = debounce(this._getValueAndUpdate, 500)
    return (
      <div className="kyc-list__input-wrapper">
        <Input
          placeholder="User Name"
          className="kyc-list__input"
          onChange={e => getValueAndUpdate(e.target.value)}
          onPressEnter={e => this
          .props
          .onChange(this.state.value)}/>
        <Icon
          type="search"
          onClick={e => this
          .props
          .onChange(this.state.value)}/>
      </div>
    )
  }
}