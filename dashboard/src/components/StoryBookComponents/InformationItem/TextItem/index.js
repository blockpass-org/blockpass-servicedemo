import React from 'react';
import '../infor-item.scss';
import { PropTypes } from 'prop-types';

const TextItem = ({ data, status }) => (
	<div className={`infor-item__wrapper ${status}`}>
		<p
			className="infor-item__content"
			style={{
				marginBottom: '0',
				whiteSpace: 'normal',
				wordbreak: 'break-word'
			}}
		>
			{data}
		</p>
	</div>
);
TextItem.propTypes = {
	/** information of blockpass */
	data: PropTypes.string.isRequired,
	/** status of this field */

	status: PropTypes.string
};
export default TextItem;
