import React, { Component } from 'react';
import { Table, Input, Icon, Button } from 'antd';
import { convertToMongoDbQuery } from '../../utils';
import { has } from 'lodash/fp';

const customFilterDropdownStyle = {
	padding: '8px',
	borderRadius: '6px',
	background: '#fff',
	boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'
};

const customFilterApplyButton = {
	width: '130px',
	marginRight: '8px'
};

const Footer = ({ total }) => {
	return (
		<div>
			<b>Total: </b>
			{`${total || 0}`}
		</div>
	);
};

class DataEntitiesTableAdvance extends Component {
	state = {
		data: [],
		pagination: {},
		loading: false,
		searchText: {},
		filtered: {}
	};

	componentDidMount() {
		this.fetchData();
	}

	handleTableChange = (pagination, filters, sorter) => {
		const pager = { ...this.state.pagination };
		pager.current = pagination.current;

		this.setState({
			pagination: pager
		});

		this.fetchData({
			results: pagination.pageSize,
			page: pagination.current,
			sortField: sorter.field,
			sortOrder: sorter.order,
			...filters
		});
	};

	fetchData = async (params = {}) => {
		const { refreshData } = this.props;
		const mongoQuery = convertToMongoDbQuery(params);

		//{results: 10, page: 4, sortField: undefined, sortOrder: undefined, gender: Array(0)}
		console.log('params:', params, mongoQuery);
		this.setState({ loading: true });

		// handle external refresh data
		let response = await refreshData(mongoQuery);
		if (response == null) {
			return this.setState({
				loading: false
			});
		}

		const data = response.body;
		const pagination = { ...this.state.pagination };
		// Read total count from server
		pagination.total = parseInt(response.headers['x-total-count'], 10);
		this.setState({
			loading: false,
			data: data,
			pagination
		});
	};

	_onInputChange = (column, e) => {
		const { searchText } = this.state;
		const val = e.target.value;

		this.setState({
			searchText: { ...searchText, [column]: val }
		});
	};

	_onSearch = (column) => {
		const customFilter = {};
		const { searchText, filtered } = this.state;

		Object.keys(searchText).forEach((key) => {
			const val = searchText[key];
			if (val !== '' && val !== null) customFilter[key] = searchText[key];
		});

		const val = customFilter[column];
		this.setState({
			filtered: { ...filtered, [column]: val !== '' && val !== undefined }
		});

		this.fetchData({ ...customFilter });
	};

	_enhanceCustomSearch(column) {
		const key = column.dataIndex;
		let searchInput;
		let visibleControlFields = `filterDropdownVisible_${key}`;
		let filteredControlFields = `${key}`;

		return {
			...column,
			filterDropdown: (
				<div style={customFilterDropdownStyle}>
					<Input
						style={customFilterApplyButton}
						ref={(ele) => (searchInput = ele)}
						placeholder="filter by..."
						value={this.state.searchText[key]}
						onChange={(e) =>
							this._onInputChange(column.dataIndex, e)}
						onPressEnter={(e) => this._onSearch(column.dataIndex)}
					/>
					<Button
						type="primary"
						onClick={(e) => this._onSearch(column.dataIndex)}
					>
						Apply
					</Button>
				</div>
			),
			filterIcon: (
				<Icon
					type="search"
					style={{
						color: this.state.filtered[filteredControlFields]
							? '#108ee9'
							: '#aaa'
					}}
				/>
			),
			filterDropdownVisible: this.state[visibleControlFields],
			onFilterDropdownVisibleChange: (visible) => {
				this.setState(
					{
						[visibleControlFields]: visible
					},
					() => searchInput && searchInput.focus()
				);
			}
		};
	}

	_explandCustomSearch(columns) {
		return columns.map((itm) => {
			if (itm.customFilter) return this._enhanceCustomSearch(itm);
			return itm;
		});
	}

	render() {
		const { columns } = this.props;
		const { data, pagination, loading } = this.state;
		const enhanceColumns = this._explandCustomSearch(columns);

		const filterData = data;

		return (
			<div style={{ display: 'flex' }}>
				<div
					style={{
						minHeight: 'calc(100vh - 90px)',
						width: '75%',
						marginLeft: '16.66666667%'
					}}
				>
					<Table
						columns={enhanceColumns}
						rowKey={(record) => record._id}
						dataSource={filterData}
						pagination={pagination}
						loading={loading}
						onChange={this.handleTableChange}
						footer={(_) => <Footer {...pagination} />}
						className="KYC-list"
					/>
				</div>
			</div>
		);
	}
}

export default DataEntitiesTableAdvance;
