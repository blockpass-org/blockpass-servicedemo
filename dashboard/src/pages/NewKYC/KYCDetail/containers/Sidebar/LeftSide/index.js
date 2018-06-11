import React from 'react';
import './LeftSideBar.scss';
import { MAP_KEYWORDS } from '../../../../map_constant';
import { Icon } from 'antd';

const MAP_ORDER_LIST = [
	'email',
	'firstName',
	'lastName',
	'address',
	'dob',
	'phone',
	'passport',
	'picture',
	'proofOfAddress'
];

const LeftSideBar = ({ data }) => {
	const orderData = MAP_ORDER_LIST.map((item) => ({
		...data.find((dataItem) => dataItem.title === item)
	})).filter((item) => Object.keys(item).length > 0);

	return (
		<div className="sidebar-component">
			<div className="sidebar-component__header">
				<h4>OVERVIEW</h4>
			</div>
			<div className="sidebar-component__body">
				<h4>Blockpass Profile</h4>
				<div className="sidebar-component__body-content">
					{orderData.map((item, index) => (
						<p key={index}>
							{item.status !== '' ? (
								<Icon type="check" />
							) : (
								<span
									style={{
										width: '14px',
										display: 'inline-block',
										marginRight: '14px'
									}}
								/>
							)}
							<span>{MAP_KEYWORDS[item.title]}</span>
						</p>
					))}
				</div>
			</div>
		</div>
	);
};

export default LeftSideBar;
