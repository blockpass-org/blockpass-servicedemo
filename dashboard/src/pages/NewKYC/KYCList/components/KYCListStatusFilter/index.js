import React, { Component } from 'react';
import { Radio, Dropdown, Icon, Menu } from 'antd';

export default class KYCListDropdown extends Component {
	state = {
		value: 'All',
		valueList: [ 'All', 'Waiting', 'In Review', 'Approved' ]
	};

	/**
 * handle when user change status filter
 *
 * @param  {evt object} e event
 */

	_onChange = (e) =>
		this.setState(
			{
				value: e.target.value
			},
			() => this.props.onChange(this.state.value)
		);

	render() {
		const menu = (
			<Menu className="kyc-dropdown-radio">
				{this.state.valueList.map((item, index) => (
					<Menu.Item key={item}>
						<Radio key={item} value={item} checked={this.state.value === item} onClick={this._onChange}>
							{item}
						</Radio>
					</Menu.Item>
				))}
			</Menu>
		);
		return (
			<div className="kyc-list__status-wrapper">
				<p className="kyc-list__status-label">Status</p>
				<Dropdown overlay={menu} trigger={[ 'click' ]}>
					<div
						style={{
							width: '140px',
							height: '50px',
							padding: '16px'
						}}
						className="kyc-list-dropdown"
					>
						{this.state.value}
						<Icon type="down" />
					</div>
				</Dropdown>
			</div>
		);
	}
}
