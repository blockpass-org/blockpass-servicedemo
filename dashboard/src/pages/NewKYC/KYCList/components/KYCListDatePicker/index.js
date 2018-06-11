import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;

export default class KYCListDatePicker extends PureComponent {
	state = {
		dateFormat: 'DD/MM/YYYY'
  };

	render() {
		const { dateFormat } = this.state;
		return (
			<div className="kyc-list__date-picker-wrapper">
				<p className="kyc-list__status-label">
					{this.props.type === 'range' ? 'Submitted Date' : 'Replied Date'}
				</p>
				{this.props.type === 'range' ? (
					<RangePicker
						onOk={this.props.onChange}
						showTime
						format={dateFormat}
						defaultValue={[ moment().subtract(1, 'day'), moment() ]}
						onChange={(value) => (value.length === 0 ? this.props.onChange(value) : false)}
						className="kyc-list__range-picker"
					/>
				) : (
					<DatePicker
						showTime
						format="DD/MM/YYYY"
						placeholder={``}
						onChange={(value) => (!value ? this.props.onChange(value) : false)}
						onOk={this.props.onChange}
					/>
				)}
			</div>
		);
	}
}
