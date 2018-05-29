import React from 'react';
import { Col, Icon } from 'antd';
import CheckboxGroup from '../../CheckboxGroup';

const FieldController = ({
	inProcess,
	status,
	onChangeHandle,
	disabledStatus,
	historyData
}) => (
	<Col span="6">
		{inProcess === 'approved' ? (
			<div className="profile-item__status-result">
				{status === 'approved' ? (
					<div className="approved">
						<Icon type="check-circle-o" />
						<span style={{ marginLeft: '10px' }}>Accepted</span>
					</div>
				) : (
					<div className="rejected">
						<Icon type="close-circle-o" />
						<span>Rejected</span>
					</div>
				)}
			</div>
		) : (
			<CheckboxGroup
				onChangeHandle={onChangeHandle}
				checked={status}
				disabled={inProcess === 'waiting' ? true : disabledStatus}
			/>
		)}
	</Col>
);

export default FieldController;
