import React, { PureComponent } from 'react';
import { inject } from 'mobx-react';
import { path, keys } from 'lodash/fp';
import { extractUrl } from '../../utils';
import { withRouter } from 'react-router';
import defaultImg from './default.png';
import { Row, Col, Icon } from 'antd';
import './certificate-review.scss';
const MODEL_NAME = 'KYCModel';

@inject('ApplicationStore')
class CertificateReview extends PureComponent {
	state = {
		id: '',
		certificate: ''
	};
	componentDidMount() {
		const { location: { query, search } } = this.props;
		const getKey = extractUrl(search);

		this.setState(
			{
				id: getKey('id'),
				certificate: getKey('certificate')
			},
			() => {
				if (query) {
					this.updateData(query.content);
				} else {
					this._fetchData();
				}
			}
		);
	}

	updateData = (dataCert) => {
		const certificateData = JSON.parse(dataCert);
		const getData = (key) => path(key)(certificateData);
		const certificate = {
			logo: getData([ 'service', 'logo' ]),
			thumbnail: getData([ 'service', 'thumbnail' ]),
			isssueDate: getData([ 'onfido_report', 'created_at' ]),
			hashNumber: {
				given_name: {
					value: getData('given_name'),
					status: 'match'
				},
				family_name: {
					value: getData('family_name'),
					status: 'match'
				},
				address: {
					value: getData('address'),
					status: 'match'
				},
				dob: { value: getData('dob'), status: 'match' },
				phone: { value: getData('phone'), status: 'match' },
				passport: {
					value: getData('address'),
					status: 'match'
				}
			}
		};
		this.setState({ ...certificate });
	};

	async _fetchData() {
		const { ApplicationStore } = this.props;
		const _id = this.state.id;

		const res = await ApplicationStore.restQueryData(MODEL_NAME, {
			query: {
				_id
			}
		});

		if (res === null || res.body.length === 0) {
			return this._showError('Data not found!');
		}

		const data = res.body[0];
		console.log(data, 'data');

		if (data) {
			this.updateData(path([ 'certs', this.state.certificate ])(data));
		}
	}

	render() {
		const { certificate, hashNumber } = this.state;
		const keyCert = keys(hashNumber) || [];
		const matchedItem = keyCert.filter(
			(item) => path([ item, 'status' ])(hashNumber) === 'match'
		).length;

		return (
			<Row>
				<Col span={16} offset={4}>
					<div className="certificate-review">
						<div className="certificate-review__wrapper">
							<div className="certificate-review__header">
								<Row className="certificate-review__header-wrapper">
									<Col
										span={12}
										className="certificate-review__header-avatar-wrapper"
									>
										<div className="certificate-review__avatar-wrapper">
											<img
												src={defaultImg}
												alt="avt fo certificate"
												className="certificate-review__avatar"
											/>
										</div>
										<div className="certificate-review__header-info-date">
											<span className="certificate-review__title">
												{certificate}
											</span>
											<p className="certificate-review__info-date__item">
												<span className="certificate-review__info-date__label">
													ISSUED DATE
												</span>
												<span className="certificate-review__info-date__value">
													18 Oct 2018
												</span>
											</p>
											<p className="certificate-review__info-date__item">
												<span className="certificate-review__info-date__label">
													EXPIRATION
												</span>
												<span className="certificate-review__info-date__value">
													18 Oct 2019
												</span>
											</p>
										</div>
									</Col>
									<Col span={12}>
										<div className="certificate-review__summarize-hash">
											<div className="certificate-review__summarize-item">
												<span className="certificate-review__summarize-item__title">
													SIGNATURE
												</span>
												<span className="certificate-review__summarize-item__value unmatched">
													Unmatched
												</span>
											</div>
											<div className="certificate-review__summarize-item hash">
												<div className="certificate-review__summarize-item__devider">
													<p>
														<span className="certificate-review__summarize-item__number">
															{matchedItem}
														</span>
														<span className="certificate-review__summarize-item__hash">
															HASH
														</span>
													</p>
													<span className="certificate-review__summarize-item__value">
														Matched
													</span>
												</div>
												<div className="certificate-review__summarize-item__devider">
													<p>
														<span className="certificate-review__summarize-item__number">
															{keyCert.length -
																matchedItem}
														</span>
														<span className="certificate-review__summarize-item__hash">
															HASH
														</span>
													</p>
													<span className="certificate-review__summarize-item__value unmatched">
														Unmatched
													</span>
												</div>
											</div>
										</div>
									</Col>
								</Row>
							</div>
							<div className="certificate-review__body">
								<div className="certificate-review__body-item">
									<Row>
										<Col span={4}>
											<span className="certificate-review__body-item__title">
												Announcement
											</span>
										</Col>
										<Col span={18}>
											<p className="">
												This is to certify that address
												has been verified and is true
												and accurate
											</p>
										</Col>
									</Row>
								</div>
								<div className="certificate-review__body-item">
									<Row>
										<Col span={4}>
											<span className="certificate-review__body-item__title">
												Detail
											</span>
										</Col>
										<Col span={20}>
											{keyCert.map((item, idx) => (
												<p
													className="certificate-review__body-item__content-wrapper"
													key={idx}
												>
													<span className="certificate-review__body-item__label">
														{item}
													</span>
													<span className="certificate-review__body-item__hash">
														{path([
															item,
															'value'
														])(hashNumber)}
													</span>
													<span className="certificate-review__body-item__status">
														<Icon
															type={
																path([
																	item,
																	'status'
																])(
																	hashNumber
																) ===
																'match' ? (
																	'check-circle-o'
																) : (
																	'exclamation-circle-o'
																)
															}
															className={`certificate-review__body-item__icon ${path(
																[
																	item,
																	'status'
																]
															)(hashNumber) ===
															'match'
																? ''
																: 'unmatched'}`}
														/>
														{path([
															item,
															'status'
														])(hashNumber) ===
														'match' ? (
															'Matched'
														) : (
															'Unmatched'
														)}
													</span>
												</p>
											))}
										</Col>
									</Row>
								</div>
								<div className="certificate-review__body-item">
									<Row>
										<Col span={4}>
											<span className="certificate-review__body-item__title">
												Signature
											</span>
										</Col>
										<Col span={20}>
											<p className="certificate-review__body-item__content-wrapper">
												<span className="certificate-review__body-item__hash-signature">
													5a2e0310c9c1e7ff26899c72c51fa36683fe2f90cb7702163c70f1aec2cf2903
												</span>
												<span className="certificate-review__body-item__status unmatched">
													<Icon
														type="exclamation-circle-o"
														className="certificate-review__body-item__icon"
													/>Unmatched
												</span>
											</p>
										</Col>
									</Row>
								</div>
							</div>
						</div>
					</div>
				</Col>
			</Row>
		);
	}
}

export default withRouter(CertificateReview);
