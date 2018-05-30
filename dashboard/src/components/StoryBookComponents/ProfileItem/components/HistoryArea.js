import React from 'react';
import { Row, Col, } from 'antd';
import CheckboxGroup from '../../CheckboxGroup';
import { ImageItem } from '../../InformationItem';

const HistoryArea = ({
	value,
	status,
	reason = '',
	onChangeHandle,
	type
}) => (
	<div className="history-comparison">
		<Row className="profile-item__content-wrapper">
			<Col span={16}>
				{type === 'text' ? (
					<div className={`profile-item__history-field ${status}`}>
						<p>{value}</p>
					</div>
				) : (
					<div
						className={`profile-item__history-field image ${status}`}
						style={{ padding: '0' }}
					>
						<ImageItem
							data={value}
							status={status}
						/>
					</div>
				)}
			</Col>
			<Col span={6}>
				<CheckboxGroup
					onChangeHandle={onChangeHandle}
					checked={status}
					disabled={true}
				/>
			</Col>
		</Row>
		<Row>
			<Row className="profile-item__content-wrapper">
				<Col span={16} className="profile-item__content">
					{reason && (
						<div className="profile-item__reason">
							<span className="profile-item__reason-label">
								Reason
							</span>
							<span className="profile-item__reason-content">
								{reason}
							</span>
						</div>
					)}
				</Col>
			</Row>
		</Row>
	</div>
);

export default HistoryArea;
