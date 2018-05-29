import React from 'react';
import { Row, Col, Icon } from 'antd';

const ReasonArea = ({
	reason,
	showModal,
	title,
	disabled,
	inProcess,
	isFirstTimeReview,
	lastSubmitData
}) => {
	const editDisable = isFirstTimeReview ? true : lastSubmitData;
	return (
		<Row className="profile-item__content-wrapper">
			<Col span={16} className="profile-item__content">
				{reason && (
					<div className="profile-item__reason">
						<span className="profile-item__reason-label">
							Reason{' '}
						</span>
						<span className="profile-item__reason-content">
							{reason}
						</span>
						{editDisable &&
						inProcess === 'inreview' && (
							<Icon
								type="edit"
								className="profile-item__edit"
								onClick={(e) => showModal(title, 'rejected')}
							/>
						)}
					</div>
				)}
			</Col>
		</Row>
	);
};

export default ReasonArea;
