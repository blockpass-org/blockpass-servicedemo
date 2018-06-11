import React, { Component } from 'react';
import { Table } from 'antd';
import { convertToMongoDbQuery } from '../../utils';
import './table.scss';
import moment from 'moment';
import { isEqual, isEmpty } from 'lodash';

const Footer = ({ total }) => {
	return (
		<div>
			<b>Total:</b>
			{`${total || 0}`}
		</div>
	);
};

class DataEntitiesTableAdvance extends Component {
	state = {
		data: [],
		pagination: {},
		loading: false
	};

	componentDidMount() {
		this.fetchData();
	}

	fetchData = async (params = {}) => {
		const { refreshData, filters = {} } = this.props;
		const mongoQuery = convertToMongoDbQuery(isEmpty(params) ? filters : params);

		// {results: 10, page: 4, sortField: undefined, sortOrder: undefined, gender:
		// Array(0)}
		console.log('params:', params, mongoQuery);
		this.setState({ loading: true });

		// handle external refresh data
		let response = await refreshData(mongoQuery);
		if (response == null) {
			return this.setState({ loading: false });
		}

		const data = response.body;
		const pagination = {
			...this.state.pagination
		};
		// Read total count from server
		pagination.total = parseInt(response.headers['x-total-count'], 10);
		this.setState({ loading: false, data: data, pagination });
	};

	/**
 * format time for table
 *
 * @param  {String} format format of moment
 * @param  {String} time time
 *
 */
	_translateMoment = (format) => (time) => moment(time).format(format);

	// shouldComponentUpdate(nextProps, nextState) {   return isEqual(nextProps,
	// this.props); }
	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps, this.props)) {
			this.fetchData(nextProps.filters);
		}
	}

	render() {
		const { columns, enhanceData, onRowClickEvent } = this.props;
		const { data, pagination, loading } = this.state;
		const dataSource = enhanceData ? enhanceData(data) : data;
		return (
			<div
				style={{
					display: 'flex'
				}}
			>
				<div
					style={{
						minHeight: 'calc(100vh - 90px)',
						width: '100%'
					}}
					className="kyc-list__table"
				>
					<Table
						columns={columns}
						rowKey={(record) => record._id}
						dataSource={dataSource}
						pagination={pagination}
						loading={loading}
						footer={(_) => <Footer {...pagination} />}
						className="kyc-list"
						onRow={(record) => ({
							onClick: (e) => (onRowClickEvent ? onRowClickEvent(record._id) : console.log(record._id))
						})}
					/>
				</div>
			</div>
		);
	}
}

export default DataEntitiesTableAdvance;
