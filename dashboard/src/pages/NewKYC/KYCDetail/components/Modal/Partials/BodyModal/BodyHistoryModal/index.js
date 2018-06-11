import React from 'react';
import { Table } from 'antd';

const columnsTable = [
	{
		title: 'DATE',
		dataIndex: 'date',
		key: 'date',
		width: '130px'
	},
	{
		title: 'ACTIVITIES',
		dataIndex: 'status',
		key: 'status',
		render: (status) => {
			switch (status) {
				case 'approved':
					return <span className="status-accepted">Accepted</span>;
				case 'rejected':
					return <span className="status-rejected">Rejected</span>;
				default:
					return <span className="status-submitted">Added</span>;
			}
		},
		width: '100px'
	},
	{
		title: 'CONTENT',
		dataIndex: 'content',
		key: 'content'
	},
	{
		title: 'BY',
		dataIndex: 'author',
		key: 'author',
		width: '160px'
	},
	{
		title: '',
		dataIndex: 'reason',
		key: 'reason',
		render: (reason) => {
			return reason && <span className="reason-history">Reason</span>;
		},
		width: '120px'
	}
];

const logData = (data = []) =>
	data.map((item, idx) => ({
		key: idx,
		date: item.date,
		status: item.status,
		content: item.value,
		author: item.author
	}));

const BodyHistoryModal = ({ history, columns = columnsTable }) => (
	<Table dataSource={logData(history)} columns={columns} />
);

export default BodyHistoryModal;
