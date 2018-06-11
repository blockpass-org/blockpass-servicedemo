import React from 'react';
import ProfileItem from '../ProfileItem';
import { PropTypes } from 'prop-types';
import { Timeline } from 'antd';
import { keys, path } from 'lodash/fp';
import './profile-list.scss';

const { Item } = Timeline;
const MODEL_LIST_CATEGORY = [
	'email',
	'name',
	'address',
	'dob',
	'phone',
	'passport',
	'picture',
	'proofOfAddress'
];

/**
 * get field items for each category
*
* @param  {object} data data og all field
* @param  {string} categoryField keyName of category  
* 
* @return {array}  array of field in this category
* 
*/

export const getCategory = (data) => (categoryField) =>
	keys(data)
		.map(
			(item) =>
				path([ item, 'category' ])(data) === categoryField
					? data[item]
					: null
		)
		.filter(Boolean);

/**
* get structure of field base on field model
*
* @param  {object} data data og all field
* @param  {function} getCategoryHandle function handle get field from data
* 
* @return {object}  
* 
*/

export const getCategoryList = (data, getCategoryHandle) => {
	const listCategory = MODEL_LIST_CATEGORY.filter((item) =>
		keys(data).some((fieldData) => data[fieldData].category === item)
	);

	return listCategory.reduce((acc, curr) => {
		acc[curr] = getCategory(data)(curr);
		return acc;
	}, {});
};

const ProfileList = ({
	data = {},
	showModal,
	status,
	historyInfo,
	waitingUserResubmit,
	zoomEvt
}) => {
	console.log(data, 'inlist');
	const dataStructure = getCategoryList(data, getCategory);

	const getHistory = (category) =>
		historyInfo.find((item) => item.keyName === category);

	return (
		<Timeline className="profile-list">
			{Object.keys(dataStructure).map((dataItem, index) => (
				<Item key={index} className={dataItem}>
					{dataStructure[dataItem].map((item, idx) => (
						<ProfileItem
							{...item}
							title={item.title.toUpperCase()}
							key={idx}
							showModal={showModal}
							inProcess={status}
							historyData={getHistory(item.keyName)}
							waitingUserResubmit={waitingUserResubmit}
							zoomEvt={zoomEvt}
						/>
					))}
				</Item>
			))}
		</Timeline>
	);
};

ProfileList.propTypes = {
	/** data of blockpass list */
	data: PropTypes.object.isRequired,
	/** event handler function */
	showModal: PropTypes.func,
	/** status of blockpass process */
	status: PropTypes.string.isRequired,
};

export default ProfileList;
