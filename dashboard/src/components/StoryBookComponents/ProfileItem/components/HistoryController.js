import React from 'react';
import { Col } from 'antd';
import historyIcon from '../history.svg';

const HistoryControl = ({ keyName, showModal }) => (
	<Col span="1">
		<div
			style={{
				backgroundImage: `url(${historyIcon})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center'
			}}
			className="profile-item__history-button"
			onClick={(e) => showModal(keyName, 'history')}
		/>
	</Col>
);

export default HistoryControl;
