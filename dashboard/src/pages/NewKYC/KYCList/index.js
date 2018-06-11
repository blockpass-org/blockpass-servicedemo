import React, { Component } from 'react';
import './kyc-list.scss';
import KYCListHeader from './containers/KYCListHeader';
import { has } from 'lodash';
import moment from 'moment';
import { inject } from 'mobx-react';
import DataEntitiesTableAdvance from '../../../components/DataEntitiesTable/DataEntitiesTableAdvance';

const MODEL_NAME = 'KYCModel';
const HOUR_FORMAT = 'HH:mm';
const DATE_FORMAT = 'DD MMM YYYY';
const selectFields = {
	_id: 1,
	submitCount: 1,
	status: 1,
	createdAt: 1,
	updatedAt: 1,
	'identities.firstName': 1,
	'identities.lastName': 1
};

const DateEle = ({ date, hour }) => (
	<p>
		{date}
		<span className="kyc-list__hour">- {hour}</span>
	</p>
);

@inject('ApplicationStore')
export default class KYCList extends Component {
	state = {
		filters: {
			createdAt: {
				endDate: moment().toDate(),
				startDate: moment().subtract(1, 'day').startOf('date').toDate()
			}
		}
	};
	_refreshData = async (queryModel) => {
		const { ApplicationStore } = this.props;
		queryModel = {
			...queryModel,
			query: {
				$and: [
					{
						...queryModel.query
					},
					{
						'identities.email': {
							$exists: true
						}
					}
				]
			}
		};

		// apply select fields
		return await ApplicationStore.restQueryData(MODEL_NAME, {
			...queryModel,
			select: selectFields,
			sort: {
				status: -1,
				updatedAt: -1
			}
		});
	};

	/**
 * render Time cell in table
 *
 * @param  {moment obj} date time
 * @param  {String} format format for moment Obj
 *
 */
	_getMomentData = (date, format) => moment(date).format(format);

	/**
 * render Time cell in table
 *
 * @param  {moment obj} date time
 *
 */
	_renderTime = (date) => (
		<DateEle date={this._getMomentData(date, DATE_FORMAT)} hour={this._getMomentData(date, HOUR_FORMAT)} />
	);

	/**
 * update filters
 *
 * @param  {Obj} filters filter for table
 *
 */
	_getFilter = (filters) => {
		this.setState({ filters });
	};

	columns = [
		{
			title: 'Status',
			dataIndex: 'status',
			render: (data) => {
				return (
					<div>
						<span className={`ant-table-status ${data}`}>{data.toUpperCase()}</span>
					</div>
				);
			},
			width: '20%',
			sorter: (a, b) => {
				const SORT_ORDER = {
					waiting: 0,
					inreview: 1,
					approved: 2,
					rejected: 3
				};
				if (has(a, 'status') && has(b, 'status')) {
					return SORT_ORDER[a.status] - SORT_ORDER[b.status];
				}
			}
		},
		{
			title: 'Name',
			dataIndex: 'userName',
			sorter: (a, b) => {
				if (has(a, 'userName') && has(b, 'userName')) {
					return a.userName.replace(' ', '').toLowerCase() < b.userName.replace(' ', '').toLowerCase()
						? 1
						: -1;
				} else return 0;
			},
			width: '22.5%'
		},
		{
			title: 'Submitted',
			dataIndex: 'submitted',
			render: this._renderTime,
			sorter: (a, b) => {
				if (has(a, 'submitted') && has(b, 'submitted')) {
					return moment(a.submitted).isAfter(moment(b.submitted)) ? 1 : -1;
				} else return 0;
			},
			width: '20%'
		},
		{
			title: (
				<p>
					Times<br />
					<span className="kyc-list__header-subtitle">(Submitted)</span>
				</p>
			),
			dataIndex: 'submitTimes',
			key: 'action',
			width: '12.5%'
		},
		{
			title: 'Replied to user',
			dataIndex: 'repliedDate',
			render: this._renderTime,
			key: 'repliedDate',
			sorter: (a, b) => {
				if (has(a, 'repliedDate') && has(b, 'repliedDate')) {
					return moment(a.repliedDate).isAfter(moment(b.repliedDate)) ? 1 : -1;
				} else return 0;
			},
			width: '25%'
		}
	];

	/**
 * format data
 *
 * @param  {Array} data data of kyc list
 *
 */
	_enhanceData(data) {
		return data.map((item) => {
			const {
				_id = 0,
				identities = {},
				status = '',
				createdAt: submitted = '',
				submitCount: submitTimes = 0,
				updatedAt: repliedDate = ''
			} =
				item || {};
			const { firstName = '', lastName = '' } = identities;

			return {
				_id,
				status,
				userName: `${firstName} ${lastName}`,
				submitted,
				submitTimes,
				repliedDate
			};
		});
	}

	/**
 * redirect to KYC detail
 *
 * @param  {string} id id of kyc
 *
 */
	_redirect = (id) => {
		const { history } = this.props;
		history.push(`/new/kyc-detail/${id}`);
	};

	render() {
		const { history } = this.props;
		return (
			<div className="kyc-list">
				<KYCListHeader onFilter={this._getFilter} />
				<DataEntitiesTableAdvance
					columns={this.columns}
					refreshData={this._refreshData}
					filters={this.state.filters}
					history={history}
					enhanceData={this._enhanceData}
					onRowClickEvent={this._redirect}
				/>
			</div>
		);
	}
}
