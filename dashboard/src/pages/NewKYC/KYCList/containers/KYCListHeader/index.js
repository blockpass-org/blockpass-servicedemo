import React, { PureComponent } from 'react';
import { KYCListDatePicker, KYCListStatusFilter, KYCListUsernameSearch } from '../../components';
import { Row, Col } from 'antd';
import moment from 'moment';
import './KYClistheader.scss';

export default class KYCListHeader extends PureComponent {
	/**
 * update status to filters
 *
 * @param  {string} status filter for status
 *
 */
	_updateStatus = (status) => {
		this.setState(
			{
				status:
					status === 'All' ? [ 'inreview', 'waiting', 'approved' ] : [ status.toLowerCase().replace(' ', '') ]
			},
			() => this.props.onFilter(this.state)
		);
	};

	/**
 * update updatedAt to filters
 *
 * @param  {momentObj} repliedDate replied date = updatedAt
 *
 */
	_updateRepliedDate = (repliedDate = '') => {
		const startDate = moment(repliedDate).startOf('date');
		const endDate = moment(repliedDate).endOf('date');
		this.setState(
			{
				updatedAt: repliedDate
					? {
							startDate: startDate.toDate(),
							endDate: endDate.toDate()
						}
					: {
							startDate: null,
							endDate: null
						}
			},
			() => this.props.onFilter(this.state)
		);
	};


	/**
 * update createdAt to filters
 *
 * @param  {Array of moment Obj} createdAt createdAt
 *
 */
	_updateSubmittedDate = (submitted = []) =>
		this.setState(
			{
				createdAt: {
					startDate: submitted.length > 0 ? submitted[0].toDate() : null,
					endDate: submitted.length > 0 ? submitted[1].toDate() : null
				}
			},
			() => this.props.onFilter(this.state)
		);

	/**
 * update username to filters
 *
 * @param  {String} name username
 *
 */
	_updateUsername = (name = '') =>
		this.setState(
			{
				name
			},
			() => this.props.onFilter({ 'identities.firstName': name })
		);

	render() {
		return (
			<div className="kyc-list__header-wrapper">
				<Row className="kyc-list__header-row">
					<Col span={3}>
						<KYCListStatusFilter onChange={this._updateStatus} />
					</Col>
					<Col span={6}>
						<KYCListDatePicker type="range" onChange={this._updateSubmittedDate} />
					</Col>
					<Col span={6}>
						<KYCListDatePicker onChange={this._updateRepliedDate} />
					</Col>
					<Col span={9} className="kyc-list__search-wrapper">
						<KYCListUsernameSearch onChange={this._updateUsername} />
					</Col>
				</Row>
			</div>
		);
	}
}
