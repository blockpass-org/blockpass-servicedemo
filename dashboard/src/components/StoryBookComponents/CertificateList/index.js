import React from 'react';
import CertificateItem from '../CertificateItem/index';
import { PropTypes } from 'prop-types';
import './certificate-list.scss';
import { Row } from 'antd';

const CertificateList = ({ data = [], reviewEvt, id }) => {
	return (
		data.length > 0 && (
			<div className="certificate-list">
				<Row>
					<div className="certificate-list__label">
						<span>ISSUED BY</span>
						<div className="certificate-list__label-date">
							<span>ISSUED DATE</span>
							<span>EXPIRATION</span>
						</div>
					</div>
				</Row>
				{data.map((item, index) => (
					<CertificateItem
						reviewEvt={reviewEvt}
						{...item}
						key={index}
						id={id}
					/>
				))}
			</div>
		)
	);
};

CertificateList.propTypes = {
	/** list certificate provider */
	data: PropTypes.array,
	/** review event when clicking review button */
	reviewEvt: PropTypes.func.isRequired
};

export default CertificateList;
