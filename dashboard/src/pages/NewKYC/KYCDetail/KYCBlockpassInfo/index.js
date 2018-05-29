import React from 'react';
import { Row, Col } from 'antd';
import ProfileList from '../../../../components/StoryBookComponents/ProfileList';

const KYCBlockpassInfo = ({
	data,
	evtHandler,
	profileItemCount,
	status,
	zoomInEvt,
	historyInfo,
}) => (
	<div className="kyc-process">
		<Row className="kyc-process__profile__title">
			<Col span={16}>
				<div>Blockpass profile</div>
			</Col>
			{status !== 'approved' && (
				<Col
					span={6}
					style={{
						paddingLeft: '25px'
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-around'
						}}
					>
						<span className="checkbox-label">ACCEPT</span>
						<span className="checkbox-label reject">REJECT</span>
					</div>
				</Col>
			)}
		</Row>

		<div className="kyc-process__profile__content">
			<ProfileList
				data={data}
				{...evtHandler}
				status={status}
				zoomInEvt={zoomInEvt}
				historyInfo={historyInfo}
			/>
		</div>
	</div>
);

export default KYCBlockpassInfo;
