import React from 'react';
import { Row, Col } from 'antd';
import Title from './Title';
import Field from './Field';
import ReasonArea from './ReasonArea';

const AddressComp = ({
	title,
	type,
	dataValue,
	status,
	reason,
	showModal,
	keyName,
	checkDisabledField
}) => (
	<Row className="profile-item__address-wrapper">
		<Col span={24} className="profile-item__address">
			<Title title={title} />
			<Field
				type={type}
				dataValue={dataValue}
				status={status}
				// zoomInEvt={zoomInEvt}
			/>
		</Col>
		<Col span={24}>
			<ReasonArea
				reason={reason}
				showModal={showModal}
				title={keyName}
				disabled={checkDisabledField}
			/>
		</Col>
	</Row>
);

export default AddressComp;
