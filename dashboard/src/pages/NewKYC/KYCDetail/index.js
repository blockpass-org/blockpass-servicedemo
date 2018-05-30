import React, { Component, Fragment } from 'react';
import { inject } from 'mobx-react';
import { path, keys, assoc } from 'lodash/fp';
import { MAP_KEYWORDS, MAP_KEYS, CONFIG_MODEL } from '../map_constant';
import { Button, Modal, Input, message, Row, Col, Icon } from 'antd';
import { translatePictureUrl, dateFormat } from '../../../utils';
import './KYCDetail.scss';
import '../../../components/StoryBookComponents/index.scss';
import KYCUserCardInfo from './KYCUserCardInfo';
import KYCBlockpassInfo from './KYCBlockpassInfo';
import KYCCertificateInfo from './KYCCertificateInfo';
import { LeftSideBar, RightSideBar } from './Sidebar';
const { TextArea } = Input;

@inject('ApplicationStore')
export default class KYCDetail extends Component {
	state = {
		loading: false,
		status: 'waiting',
		userID: '',
		userEmail: '',
		checkID: () => this.reviewID(),
		certificateItemCount: 0,
		data: [],
		profileItemCount: 0,
		evtHandler: {
			showModal: (title, type) => this._showModal(title, type)
		},
		dataCert: [],
		reviewEvt: () => console.log('review'),
		historyModalStatus: false,
		submitReason: '',
		modal: '',
		historyField: [],
		authors: {},
		reSubmitData: []
	};

	/**
 * start review calling
 */

	async reviewID() {
		const { ApplicationStore } = this.props;
		const startReviewProcess = await ApplicationStore.startReview(
			this.state.userID,
			'beginning review'
		);

		if (!startReviewProcess) {
			return this._showError('server error');
		}
		this._fetchData();
	}
	/**
 * show error
 * 
 */
	_showError(msg) {
		message.warning(msg);
	}

	/**
 * fetch KYCModel and KYCLog of Profile from API
 * 
 */

	async _fetchData() {
		const { ApplicationStore } = this.props;
		const _id = this._id;

		const res = await ApplicationStore.restQueryData(
			'KYCModel',
			CONFIG_MODEL.KYCModel(_id)
		);

		if (res === null || res.body.length === 0) {
			return this._showError('Data not found!');
		} else {
			const history = (await this._fetchHistory()) || { body: [] };
			if (history) {
				const data = res.body[0];
				const historyData = history.body;

				const profileData = keys(
					data.identities
				).reduce((profile, curr) => {
					const logData = this._checkLogData({
						log: historyData,
						reviews: data.reviews,
						category: curr,
						type: MAP_KEYS[curr].type,
						isWaitingUserResubmit: data.waitingUserResubmit
					});
					profile[curr] = this._updateFieldStatus(
						{
							...MAP_KEYS[curr],
							history: logData,
							keyName: curr,
							dataValue:
								MAP_KEYS[curr].type === 'image'
									? translatePictureUrl(
											path([ 'identities', curr ])(data)
										)
									: path([ 'identities', curr ])(data)
						},
						path([ 'reviews', curr, 'status' ])(data),
						path('status')(data)
					);

					return profile;
				}, {});
				this.setState({
					profileData,
					userID: data._id,
					userEmail: path([ 'identities', 'email' ])(data),
					status: data.status,
					waitingUserResubmit: data.waitingUserResubmit
				});
				this._historyHandel(historyData);
				this.setState({ history: historyData });
			}
		}
	}

	/**
 * fetch KYCLog of Profile from API
 * 
 */

	async _fetchHistory() {
		const { ApplicationStore } = this.props;
		const _id = this._id;
		const history = await ApplicationStore.restQueryData(
			'LogModel',
			CONFIG_MODEL.LOGModel(_id)
		);

		if (history === null || history.body.length === 0) {
			return;
		} else {
			return history;
		}
	}

	/**
 * handle data history
 *
 * @param  {object} history history of this profile
 * 
 */

	_historyHandel = (history) => {
		const author = [
			...new Set(
				history
					.map((item) => path([ 'extra', 'by' ])(item))
					.filter(Boolean)
			)
		];
		author.forEach((item) => {
			this._getUsername(item);
		});
		const checkResubmit =
			history
				.filter((item) => item.message === 'record-waiting')
				.some((item) => path([ 'extra', 'submitCount' ])(item) > 1) &&
			path([ '0', 'message' ])(history) !== 'record-approve';
		if (checkResubmit) {
			let reSubmitData = this.state.reSubmitData;
			const changeLogs = path([ '0', 'extra', 'changeLogs' ])(
				history.filter((item) => item.message === 'record-waiting')
			);
			if (!reSubmitData.length) {
				reSubmitData = changeLogs.map((item) => ({
					keyName: item.slug,
					value: item.new
				}));
			} else {
				reSubmitData = reSubmitData
					.filter((item) =>
						changeLogs.some(
							(submitData) => submitData.slug === item.keyName
						)
					)
					.map((item) => ({
						...item,
						value: path([ 'new' ])(
							changeLogs.find(
								(data) => data.slug === item.keyName
							)
						)
					}));
			}
			console.log(reSubmitData, 'history');
			this.setState({ reSubmitData });
		} else this.setState({ reSubmitData: [] });
	};

	/**
 * get username base on id
 *
 * @param  {string} id id of user
 * 
 */

	async _getUsername(id) {
		const { ApplicationStore } = this.props;
		const userName = await ApplicationStore.getUsername(id);
		this.setState({
			authors: assoc(id, path([ 'body', 'userName' ])(userName))(
				this.state.authors
			)
		});
	}

	/**
 * take action approve certificate
 * 
 */

	async approveCertificate() {
		const { ApplicationStore } = this.props;
		const { profileData } = this.state;
		const data = keys(profileData).map((item) => ({
			slug: item,
			comment: profileData[item].reason,
			status:
				profileData[item].status === 'approved'
					? 'approved'
					: 'rejected',
			type: 'identities'
		}));
		const reviewProcess = await ApplicationStore.approveCertificate(
			this.state.userID,
			this.state.submitReason,
			data
		);

		if (
			reviewProcess &&
			path([ 'body', 'cer', 'data', 'bpSignRes', 'res', 'status' ])(
				reviewProcess
			) === 'success'
		) {
			this._closeApproval();
			message.success('your profile has been certificated !');
			this.props.history.push('/');
		}
	}

	/**
 * take action send feedback to server
 * 
 */

	async sendFeedback() {
		const { ApplicationStore } = this.props;
		const { profileData } = this.state;
		const data = keys(profileData).map((item) => ({
			slug: item,
			comment: profileData[item].reason,
			status: profileData[item].status,
			type: 'identities'
		}));

		const reviewProcess = await ApplicationStore.sendFeedback(
			this.state.userID,
			this.state.submitReason,
			data
		);
		if (reviewProcess) {
			message.success('your feedback has been sent !');
			this._closeApproval();
			return Promise.all([ this._fetchData() ]);
		}
	}

	componentDidMount() {
		const { match } = this.props;
		this._id = match.params.id;
		this._fetchData();
	}

	/**
 * get log history of field in profile
 *
 * @param  {array} log Log file after fetching history from API
 * @param  {string} category keyName of Field 
 * 
 * @return {array}  array of log field 
 * 
 */

	_getLogStory = ({ log = [], category = '' }) =>
		log
			.map((item) => {
				if (
					item.message === 'field-decision' &&
					path([ 'extra', 'slug' ])(item) === category
				) {
					const getLogField = (field) =>
						path([ 'extra', field ])(item);
					return {
						status: getLogField('status') || '',
						comment: getLogField('comment') || '',
						author: getLogField('by') || '',
						date: item.createdAt || '',
						message: item.message || ''
					};
				} else if (item.message === 'record-waiting') {
					const checkFieldReSubmitted = path([
						'extra',
						'changeLogs'
					])(item).some((item) => item.slug === category);
					if (checkFieldReSubmitted) {
						return {
							status: 'submitted',
							comment: '',
							author: 'user',
							date: item.createdAt || '',
							message: item.message || ''
						};
					} else return null;
				} else return null;
			})
			.filter(Boolean);

	/**
 * execute status for field data
 *
 * @param  {obj} fieldData the latest log data of this field
 * @param  {string} latestStatus the latest status of this field
 * @param  {string} profileStatus the status of profile
 * 
 * @return {Obj}  Object of this field has status value
 * 
 */

	_updateFieldStatus = (fieldData, latestStatus, profileStatus) => {
		const fieldHistory = path([ 'history', 'logStory' ])(fieldData).filter(
			(item) => item.message === 'field-decision'
		);
		const lastSubmitData = path([ 'history', 'lastSubmitData' ])(fieldData);
		const fieldStatus =
			fieldHistory.length > 0 ? fieldHistory[0].status : 'submitted';
		const fieldComment =
			fieldHistory.length > 0 ? fieldHistory[0].comment : '';
		if (profileStatus === 'approved') {
			return {
				...fieldData,
				status: 'approved',
				reason: ''
			};
		}
		return {
			...fieldData,
			status:
				latestStatus === 'received' && lastSubmitData
					? 'submitted'
					: fieldStatus,
			reason:
				latestStatus === 'received' && lastSubmitData
					? ''
					: fieldComment
		};
	};

	/**
 * get last submitted data from user of field in profile
 *
 * @param  {obj} lastSubmitData the latest log data of this field
 * @param  {string} category keyName of Field 
 * 
 * @return {Obj}  Object of last submitted of this field ( get null value when nothing changed in the last submitted)
 * 
 */

	_getLatestSubmittedData = ({
		lastSubmitData,
		category,
		reviews,
		type,
		logStory,
		isWaitingUserResubmit
	}) => {
		// debugger;
		if (
			path([ 'extra', 'submitCount' ])(lastSubmitData) === 1 ||
			!lastSubmitData
		) {
			return null;
		}
		const changeLog = path([ 'extra', 'changeLogs' ])(lastSubmitData).find(
			(item) => item.slug === category
		);
		if (changeLog) {
			const getLatestData = logStory.filter(
				(item) => item.message === 'field-decision'
			) || [ { status: '', comment: '' } ];
			if (changeLog && changeLog.new !== changeLog.old) {
				return {
					...reviews[category],
					status: getLatestData[isWaitingUserResubmit ? 1 : 0].status,
					reason:
						getLatestData[isWaitingUserResubmit ? 1 : 0].comment,
					value:
						type === 'image'
							? translatePictureUrl(changeLog.old)
							: changeLog.old
				};
			} else return null;
		} else return null;
	};

	/**
 * get history data from user of field in profile
 *
 * @param  {array} log the current log data of this field
 * @param  {object} reviews Object of reviews data after fetching in KYCModel
 * @param  {string} category keyName of Field 
 * @param  {string} type type of Field 
 * @param  {boolean} isWaitingUserResubmit checking user resubmit
 * 
 * @return {Obj}  Object of history of this field
 * 
 */
	_checkLogData = ({
		log,
		reviews,
		category,
		type,
		isWaitingUserResubmit
	}) => {
		if (log.length === 0)
			return {
				currentSubmitted: null,
				logStory: [],
				lastSubmitData: null
			};
		const currentSubmitted = path([ '0', 'extra', 'submitCount' ])(
			log
				.filter((item) => item.message === 'record-waiting')
				.sort((cur, last) => cur.submitCount - last.submitCount)
		);

		const logStory = this._getLogStory({ log, category });
		const lastSubmitData = log.find(
			(item) =>
				item.message === 'record-waiting' &&
				path([ 'extra', 'submitCount' ])(item) === currentSubmitted
		);

		return {
			currentSubmitted,
			logStory,
			// lastSubmitData - get null value for the field is not resubmitted
			lastSubmitData: this._getLatestSubmittedData({
				lastSubmitData,
				reviews,
				category,
				type,
				logStory,
				isWaitingUserResubmit
			})
		};
	};

	_okModal = (type) => (e) => {
		const { profileData, infoItemChecking, submitReason } = this.state;
		profileData[infoItemChecking] = {
			...profileData[infoItemChecking],
			status: 'rejected',
			reason: submitReason
		};

		this.setState({ profileData }, () => this._cancelModal());
	};

	_showModal = (title, type) => {
		if (type === 'approved') {
			const { profileData } = this.state;
			profileData[title] = {
				...profileData[title],
				status: 'approved',
				reason: ''
			};
			this.setState({ profileData });
		} else {
			let historyField = [];
			if (this.state.history) {
				if (this.state.history.length > 0) {
					historyField = this.state.history.map((item) => {
						switch (item.message) {
							case 'record-waiting':
								const logData = path([ 'extra', 'changeLogs' ])(
									item
								).find((item) => item.slug === title);

								return {
									createdAt: item.createdAt,
									author: path([ 'extra', '_id' ])(item),
									status:
										path([ 'extra', 'submitCount' ])(
											item
										) === 1
											? 'submitted'
											: 'resubmitted',
									oldValue: path('old')(logData),
									newValue: path('new')(logData)
								};
							case 'field-decision':
								const itemData = path([ 'extra' ])(item);
								return itemData.slug === title
									? {
											createdAt: item.createdAt,
											author: itemData.by,
											status: itemData.status,
											comment: itemData.comment
										}
									: {};
							default:
								return {};
						}
					});
				}
				// historyField = this   .state   .history   .filter((item) => path(['extra',
				// 'slug'])(item) === title);
			}
			this.setState({
				modal: type,
				infoItemChecking: title,
				historyField: historyField.filter((item) => keys(item).length)
			});
		}
	};

	_cancelModal = (e) => this.setState({ modal: '', submitReason: '' });
	_afterClose = (e) => this.setState({ infoItemChecking: '' });

	/** TODO: OPEN POPUP TO CHOOSE FOR PASSPORT */
	// zoomInEvt = () => this.setState({ modal: 'image-zoom' });
	zoomInEvt = () => console.log('zoom');

	_approvalHandle = (e) => this.approveCertificate();

	_sendFeedbackHandle = (e) => this.sendFeedback();

	_approvalStatus = () =>
		this.state.data.every((item) => item.status === 'approved');

	_closeApproval = (e) =>
		this.setState(
			{
				modal: ''
			},
			() => this.setState({ submitReason: '' })
		);

	render() {
		const {
			status,
			userID,
			userEmail,
			checkID,
			data,
			evtHandler,
			profileItemCount,
			dataCert,
			reviewEvt,
			certificateItemCount,
			history,
			profileData,
			waitingUserResubmit
		} = this.state;
		const { collapsed } = this.props;

		const profileCheckSideBarData = keys(profileData).map((item) => ({
			title: item,
			status:
				profileData[item].status === 'approved' ||
				profileData[item].status === 'rejected'
					? profileData[item].status
					: ''
		}));
		const feedBackDisableStatus =
			status === 'waiting' || waitingUserResubmit
				? true
				: !(
						profileCheckSideBarData.every(
							(item) =>
								item.status === 'rejected' ||
								item.status === 'approved'
						) &&
						!profileCheckSideBarData.every(
							(item) => item.status === 'approved'
						)
					);
		const approvalDisableStatus =
			status === 'waiting' || waitingUserResubmit
				? true
				: !profileCheckSideBarData.every(
						(item) => item.status === 'approved'
					);
		return (
			userID &&
			data && (
				<Row key="kyc-main">
					<Col span={4}>
						<LeftSideBar data={profileCheckSideBarData} />
					</Col>
					<Col span={collapsed ? 14 : 18} className="kyc-main">
						<div className="kyc-detail">
							<KYCUserCardInfo
								status={status}
								userID={userID}
								userEmail={userEmail}
								checkID={checkID}
								collapsed={this.props.collapsed}
								hasCerts={
									Object.keys(this.state.certs || {}).length >
									0
								}
							/>
							{keys(this.state.profileData).length > 0 && (
								<KYCBlockpassInfo
									data={this.state.profileData}
									evtHandler={evtHandler}
									profileItemCount={profileItemCount}
									status={
										this.state.waitingUserResubmit ? (
											'waiting'
										) : (
											status
										)
									}
									waitingUserResubmit={waitingUserResubmit}
									historyInfo={this.state.reSubmitData}
								/>
							)}
							{this.state.certificateItemCount > 0 && (
								<KYCCertificateInfo
									dataCert={dataCert}
									reviewEvt={reviewEvt}
									certificateItemCount={certificateItemCount}
									id={this.state.userID}
								/>
							)}
							<div
								className="kyc-process"
								style={{
									display:
										status === 'approved' ? 'none' : 'flex',
									maxWidth: '800px',
									margin: '0 auto'
								}}
							>
								{status !== 'approved' && (
									<Fragment>
										<Button
											className={`big blue ${feedBackDisableStatus
												? 'disabled'
												: ''}`}
											onClick={() =>
												this.setState({
													modal: 'send-feedback'
												})}
											disabled={feedBackDisableStatus}
										>
											SEND FEEDBACK
										</Button>
										<Button
											className={`big ${approvalDisableStatus
												? 'disabled'
												: ''}`}
											onClick={() =>
												this.setState({
													modal: 'approval'
												})}
											disabled={approvalDisableStatus}
										>
											APPROVAL
										</Button>
										{/* <Button
		            className={`big pink ${disabledStatus || checkFullfill || this.state.waitingUserResubmit
		            ? 'disabled'
		            : ''}`}
		            onClick={() => console.log('click')}
		            disabled={disabledStatus || checkFullfill}>
		            REJECT FOREVER
		          </Button> */}
									</Fragment>
								)}
							</div>
							<Modal
								title="GIVE THE REASON"
								_afterClose={this._afterClose}
								visible={this.state.modal === 'rejected'}
								wrapClassName="vertical-center-modal"
								footer={[
									<span
										key="cancel-reject-modal-kyc"
										onClick={this._cancelModal}
										className="modal-footer-label"
									>
										SKIP
									</span>,
									<span
										key="ok-reject-modal-kyc"
										onClick={this._okModal('reject')}
										className="modal-footer-label unaccept"
									>
										SAVE
									</span>
								]}
								onCancel={this._cancelModal}
								className="modal-accept"
							>
								<p>
									Please give the reason why you rejected this
									field
								</p>
								<TextArea
									row={8}
									onChange={(e) =>
										this.setState({
											submitReason: e.target.value
										})}
									value={this.state.submitReason}
								/>
							</Modal>
							{
								<Modal
									wrapClassName="vertical-center-modal"
									title={`History of ${MAP_KEYWORDS[
										this.state.infoItemChecking
									]}`}
									visible={this.state.modal === 'history'}
									onCancel={this._cancelModal}
									className="modal-history"
									_afterClose={this._afterClose}
								>
									{this.state.historyField.length > 0 ? (
										this.state.historyField.map(
											(item, idx) => (
												<div
													key={idx}
													className="modal-history__content"
												>
													{item.status ===
														'approved' && (
														<Icon
															type="check-circle-o"
															className="modal-history__icon"
														/>
													)}
													{item.status ===
														'rejected' && (
														<Icon
															type="exclamation-circle-o"
															className="modal-history__icon rejected"
														/>
													)}
													{item.status ===
														'submitted' && (
														<Icon
															type="edit"
															className="modal-history__icon edited"
														/>
													)}
													{item.status ===
														'resubmitted' && (
														<Icon
															type="edit"
															className="modal-history__icon edited"
														/>
													)}
													<div className="modal-history__status">
														<span>
															{item.status ===
															'approved' ? (
																'Accepted'
															) : item.status ===
															'rejected' ? (
																'Rejected'
															) : (
																item.status
															)}
														</span>
														<span className="modal-history__date">
															{dateFormat(
																item.createdAt
															)}
														</span>
													</div>
													<div className="modal-history__author">
														<p>
															{`by `}
															{this.state.authors[
																item.author
															] || 'user'}
														</p>
													</div>
												</div>
											)
										)
									) : (
										<p>No history found</p>
									)}
								</Modal>
							}
							<Modal
								title="CERTIFICATE GENERATION"
								_afterClose={this._afterClose}
								visible={this.state.modal === 'approval'}
								wrapClassName="vertical-center-modal modal-send-approve"
								footer={[
									<Button
										key="cancel-approval-modal-kyc"
										onClick={this._approvalHandle}
										className="medium"
										loading={
											this.props.ApplicationStore
												.isLoading
										}
									>
										{this.state.submitReason ? (
											'GENERATE'
										) : (
											'CERTIFICATE GENERATION'
										)}
									</Button>,
									<span
										key="ok-approval-modal-kyc"
										onClick={this._closeApproval}
										className=""
									>
										CANCEL
									</span>
								]}
								onCancel={() => this._closeApproval}
								className="modal-accept"
							>
								<TextArea
									row={8}
									onChange={(e) =>
										this.setState({
											submitReason: e.target.value
										})}
									value={this.state.submitReason}
								/>
							</Modal>
							<Modal
								title="GIVE THE REASON"
								_afterClose={this._afterClose}
								visible={this.state.modal === 'send-feedback'}
								wrapClassName="vertical-center-modal modal-send-feedback"
								footer={[
									<Button
										key="cancel-feedback-modal-kyc"
										onClick={this._sendFeedbackHandle}
										loading={
											this.props.ApplicationStore
												.isLoading
										}
										className="medium"
									>
										{this.state.submitReason ? (
											'SEND TO USER'
										) : (
											'SEND WITHOUT REASON'
										)}
									</Button>,
									<span
										key="ok-feedback-modal-kyc"
										onClick={this._closeApproval}
										className=""
									>
										CANCEL
									</span>
								]}
								onCancel={this._closeApproval}
								className="modal-accept"
							>
								<p>
									Please give the reason why you rejected this
									profile.
								</p>
								<TextArea
									row={8}
									onChange={(e) =>
										this.setState({
											submitReason: e.target.value
										})}
									value={this.state.submitReason}
								/>
							</Modal>
							{data.length > 0 && (
								<Modal
									title=""
									_afterClose={this._afterClose}
									visible={this.state.modal === 'image-zoom'}
									wrapClassName="vertical-center-modal modal-send-feedback"
									onCancel={this._closeApproval}
									className="modal-zoom-image"
									bodyStyle={{
										width: 'auto'
									}}
								>
									<div
										className="modal-zoom-image__content-wrapper"
										style={{
											width: '660px',
											height: '660px',
											backgroundColor: 'black'
										}}
									>
										<div
											className="modal-zoom-image__content"
											style={{
												// backgroundImage: `url(${passportItem.dataValue})`,
												backgroundSize: 'cover',
												backgroundRepeat: 'no-repeat',
												backgroundPositionX: 'center',
												height: '100%',
												margin: '0 auto'
											}}
										/>
									</div>
									<div className="modal-zoom-image__action">
										<div />
									</div>
								</Modal>
							)}
						</div>
					</Col>
					<Col
						span={this.props.collapsed ? 6 : 0}
						className="kyc-right-side"
					>
						{
							<RightSideBar
								authors={this.state.authors}
								open={this.props.collapsed}
								historyData={history}
							/>
						}
					</Col>
				</Row>
			)
		);
	}
}
