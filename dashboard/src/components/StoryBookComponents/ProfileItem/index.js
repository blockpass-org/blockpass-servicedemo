import React from 'react';
import { Row, Col } from 'antd';
import { PropTypes } from 'prop-types';

import { MAP_ADDRESS_ORDER } from '../../../pages/NewKYC/map_constant';
import classnames from 'classnames';
import './profile-item-wrapper.scss';
import '../theme/index.scss';
import {
	Title,
	Field,
	FieldController,
	HistoryControl,
	HistoryArea,
	ReasonArea,
	AddressComp
} from './components';

/**
 * parse address data from json
 *
 * @param  {object} dataValue value of this field
 * @param  {string} keyName value of keyName
 * 
 * @return {Object}
 * 
 */

export const getAddressValue = ({ keyName, dataValue }) => {
	let result = {};
	if (keyName === 'address') {
		try {
			result = JSON.parse(dataValue);
		} catch (e) {
			result = {
				address: dataValue
			};
		}
	}

	return result;
};

/**
 * Get data from Address Object
 *
 * @param  {object} addressData value of address field
 * @param  {string} keyName value of keyName
 * 
 * @return {Object}
 * 
 */

export const getAddressKeyMap = ({ addressData, keyName }) => {
	return MAP_ADDRESS_ORDER.map((item) => ({
		...item,
		value: addressData[item.keyName]
	})).filter((item) => item.value);
};

const ProfileItem = ({
	title,
	dataValue,
	status,
	reason,
	keyName,
	type = 'text',
	checked,
	disabled,
	showModal,
	inProcess,
	historyData,
	history,
	waitingUserResubmit
}) => {
	const { lastSubmitData } = history;
	let addressHistory = null;
	let addressData = null;
	let addressHistoryMap = null;
	let addressMap = null;
	const isFirstTimeReview = !history.logStory.some(
		(item) => item.message === 'field-decision'
	);
	const checkDisabledField =
		inProcess === 'inreview' &&
		lastSubmitData === null &&
		!waitingUserResubmit;
	const wrapperClassName = classnames({
		'profile-item__content-wrapper': true,
		image: type === 'image',
		disabled: checkDisabledField
	});
	const onChangeHandle = (value) => showModal(keyName, value);

	if (keyName === 'address') {
		addressData = getAddressValue({ keyName, dataValue });
		addressMap = getAddressKeyMap({ addressData, keyName });
		if (lastSubmitData) {
			addressHistory = getAddressValue({
				keyName,
				dataValue: lastSubmitData.value
			});

			addressHistoryMap = getAddressKeyMap({
				addressData: addressHistory,
				keyName
			});
		}
	}

	return (
		<div className={`profile-item ${keyName}`}>
			{keyName !== 'address' && <Title title={title} />}
			<Row className={wrapperClassName}>
				{keyName !== 'address' ? (
					<Field type={type} dataValue={dataValue} status={status} />
				) : (
					<Col span={16} style={{ marginRight: '8px' }}>
						{addressMap &&
							addressMap.map((item, index) => (
								<AddressComp
									key={`address-field-${index}`}
									type={type}
									dataValue={item.value}
									status={status}
									{...item}
									disabledStatus={checkDisabledField}
									isFirstTimeReview={isFirstTimeReview}
								/>
							))}
						<div style={{ marginTop: '10px' }}>
							{addressHistoryMap &&
								inProcess !== 'approved' &&
								addressHistoryMap.map((item, index) => (
									<Row key={index}>
										<h4
											className={`profile-item__history-field address`}
										>
											{item.title}
										</h4>
										<Col span={24}>
											<div
												className={`profile-item__history-field ${lastSubmitData.status}`}
											>
												<p>{item.value}</p>
											</div>
										</Col>
									</Row>
								))}
						</div>
					</Col>
				)}
				<FieldController
					inProcess={inProcess}
					status={status}
					onChangeHandle={onChangeHandle}
					disabledStatus={checkDisabledField}
					isFirstTimeReview={isFirstTimeReview}
				/>
				<HistoryControl keyName={keyName} showModal={showModal} />
			</Row>
			<ReasonArea
				reason={reason}
				showModal={showModal}
				title={keyName}
				disabled={checkDisabledField}
				isFirstTimeReview={isFirstTimeReview}
				lastSubmitData={!!history.lastSubmitData}
				inProcess={inProcess}
			/>
			{lastSubmitData &&
			inProcess !== 'approved' &&
			keyName !== 'address' && (
				<HistoryArea
					{...lastSubmitData}
					type={type}
					onChangeHandle={onChangeHandle}
				/>
			)}
		</div>
	);
};

ProfileItem.propTypes = {
	/**  title of field data  */
	title: PropTypes.string.isRequired,
	/**  value of field data  */
	dataValue: PropTypes.string.isRequired,
	/**  status of field data (approved , rejected or disabled) */
	status: PropTypes.string.isRequired,
	/**  reason of field data when rejected */
	reason: PropTypes.string,
	/**  type of field data (image or text) */
	type: PropTypes.string.isRequired,
	/**  certification status ('approved' or 'rejected')*/
	checked: PropTypes.string,
	/** certification status are disabled ( an array contains strings) */
	disabled: PropTypes.array,
	/** show modal before accept or reject */
	showModal: PropTypes.func,
	/** current process of blockpass flow */
	inProcess: PropTypes.string
	/** event handle when zoom in image */
};

export default ProfileItem;
