import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Row, Col } from 'antd';
import './review.scss';

// const ResultInfo = ({ match, unMatch }) => ( 	<div
// className="result-info__wrapper"> 		<div className="result-info__item">
// 			<span className="result-info__label">Matched</span> 			<p
// className="result-info__data"> 				<span
// className="result-info__quantity">{match}</span> 				<span
// className="result-info__unit">Hash</span> 			</p> 		</div> 		<div
// className="result-info__item"> 			<span className="result-info__label
// unmatch">Unmatched</span> 			<p className="result-info__data"> 				<span
// className="result-info__quantity">{unMatch}</span> 				<span
// className="result-info__unit">Hash</span> 			</p> 		</div> 	</div> );

class UserCard extends Component {
	static propTypes = {
		/** Status of Card Item - consist of : "result", "checking", "waiting"*/
		status: PropTypes.string.isRequired,
		/** ID of user */
		userID: PropTypes.string.isRequired,
		/** Email of user */
		userEmail: PropTypes.string,
		/**  response data after checking ID - consist of: match  and unmatch data */
		userData: PropTypes.shape({
			match: PropTypes.number,
			unmatch: PropTypes.number
		}),
		/**  action to checkID */
		checkID: PropTypes.func.isRequired,
		/** checking certificate provided*/
		hasCerts: PropTypes.bool.isRequired
	};

	checkIDhandler = (evt) => this.props.checkID();

	state = {
		percent: 50
	};

	render() {
		const { status, userID, userEmail, collapsed } = this.props;
		const cardWrapperClass = classnames('user-card__info', {
			approved: status === 'approved',
			feedback: status === 'feedback',
			rejected: status === 'reject forever'
		});
		return (
			<div
				className={`user-card ${status === 'waiting'
					? ''
					: 'full-width'}`}
			>
				<Row
					className="user-card__wrapper"
					style={{
						display: 'flex',
						flexDirection: `${collapsed ? 'column' : 'row'}`
					}}
				>
					<Col
						span={!collapsed ? status === 'waiting' ? 16 : 14 : 24}
						className={cardWrapperClass}
					>
						<div className={`info ${status}`}>
							{(status === 'approved' ||
								status === 'rejected') && (
								<div className={`info__status`}>
									<span
										className={`info__status-value ${status}`}
									>
										{status.toUpperCase()}
									</span>
									<span className="info__status-date">
										09 Jun 2018
									</span>
								</div>
							)}
							<div className="info__item">
								<span className="info__label">User ID</span>
								<span className="info__value">{userID}</span>
							</div>
							{userEmail && (
								<div className="info__item">
									<span className="info__label">Email</span>
									<span className="info__value">
										{userEmail}
									</span>
								</div>
							)}
						</div>
					</Col>
					{status === 'waiting' && (
						<Col
							span={8}
							className={`user-card__status ${status === 'result'
								? 'result'
								: ''}`}
							style={{
								margin: `${collapsed ? '15px auto 0' : ''}`
							}}
						>
							<Button
								className="medium"
								onClick={this.checkIDhandler}
							>
								START REVIEW
							</Button>
						</Col>
					)}
				</Row>
			</div>
		);
	}
}

export default UserCard;
