import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'antd';
import defaultAvatar from './default.png';
import './Certificate.scss';

const CertificateItem = ({
	avtUrl = defaultAvatar,
	title,
	issueDate,
	expiration,
	status = 'notReviewed',
	data = { signature: null, match: 0, unmatch: 0 },
	reviewEvt,
	id,
	content
}) => {
	return (
		<div className="certificate-item">
			<div className="certificate-item__info-wrapper">
				<div className="certificate-item__info">
					<div
						className="certificate-item__avatar"
						style={{
							backgroundImage: `url(${avtUrl})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}}
					/>
					<span className="certificate-item__title">{title}</span>
				</div>
				<div className="certificate-item__date-wrapper">
					<span className="certificate-item__date">{issueDate}</span>
					<span className="certificate-item__date">{expiration}</span>
				</div>
			</div>
			<div className="certificate-item__result-wrapper">
				{status !== 'reviewed' ? (
					<Link
						to={{
							pathname: '/review-certificate',
							query: {
								content: content
							},
							search: `id=${id}&certificate=${title}`
						}}
					>
						<Button
							onClick={(evt) => reviewEvt()}
							className={`small ${status === 'notReviewed'
								? 'disabled'
								: ''}`}
							disabled={status === 'notReviewed'}
						>
							Review
						</Button>
					</Link>
				) : (
					<div className="certificate-item__result">
						<div className="certificate-item__result-category">
							<span className="certificate-item__result-title">
								Signature
							</span>
							<div className="certificate-item__result-data-wrapper">
								<Icon
									type={
										data.signature ? (
											'check-circle-o'
										) : (
											'exclamation-circle-o'
										)
									}
								/>
							</div>
						</div>
						<div className="certificate-item__result-category">
							<span className="certificate-item__result-title">
								Hash
							</span>
							<div className="certificate-item__result-data-wrapper">
								<span className="certificate-item__result-data">
									{data.match}
								</span>
								<Icon type="check-circle-o" className="match" />
								<span className="certificate-item__result-data">
									{data.unmatch}
								</span>
								<Icon type="exclamation-circle-o" />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

CertificateItem.propTypes = {
	/**  Avatar of certificate provider */
	avtUrl: PropTypes.string,
	/**  name of certificate provider  */
	title: PropTypes.string.isRequired,
	/**  issused date of validation */
	issueDate: PropTypes.string.isRequired,
	/**  expiration of validation */
	expiration: PropTypes.string.isRequired,
	/**  status of validation */
	status: PropTypes.string.isRequired,
	/** data of validation (signature, match & unmatch)  */
	data: PropTypes.shape({
		signature: PropTypes.bool,
		match: PropTypes.number,
		unmatch: PropTypes.number
	}),
	/** review action  */

	reviewEvt: PropTypes.func.isRequired
};

export default CertificateItem;
