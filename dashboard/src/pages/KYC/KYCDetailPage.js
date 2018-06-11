import React, { Component } from 'react';
import { Modal, Card, Steps, message, Col, Row } from 'antd';
import { inject } from 'mobx-react';
import ReviewSections from './containers/ReviewSections';
import UserDetailDisplay from './components/UserDetailDisplay';
import UserActivityHistory from './components/UserActivityHistory';
import CertificateDisplay from './components/CertificateDisplay';

const Step = Steps.Step;
const MODEL_NAME = 'KYCModel';

const STATE_MAPPING = {
	waiting: 0,
	inreview: 1,
	approved: 2
};

@inject('ApplicationStore')
class UserDetailPage extends Component {
	state = {
		data: {},
		history: [],
		cer: null
	};

	componentDidMount() {
		const { match } = this.props;
		this._id = match.params.id;
		this._fetchData();
		this._fetchHistory();
		this._fetchCertificate();
	}

	_showError(msg) {
		message.warning(msg);
	}

	async _fetchData() {
		const { ApplicationStore } = this.props;
		const _id = this._id;

		const res = await ApplicationStore.restQueryData(MODEL_NAME, {
			query: {
				_id
			}
		});

		if (res === null || res.body.length === 0) {
			return this._showError('Data not found!');
		}

		const data = res.body[0];
		console.log(data);
		this.setState({ data });
	}

	async _fetchHistory() {
		const { ApplicationStore } = this.props;
		const _id = this._id;

		const res = await ApplicationStore.restQueryData('LogModel', {
			query: {
				userId: _id
			},
			sort: {
				createdAt: -1
			},
			select: {
				type: 1,
				message: 1,
				extra: 1,
				createdAt: 1
			},
			limit: 50
		});

		if (res === null || res.body.length === 0) {
			return;
		}
		const history = res.body;
		console.log(history);

		this.setState({ history });
	}

	async _fetchCertificate() {
		const { ApplicationStore } = this.props;
		const _id = this._id;

		const res = await ApplicationStore.restQueryData('CertificateModel', {
			query: {
				kycId: _id
			},
			sort: {
				createdAt: -1
			},
			select: {
				type: 1,
				data: 1,
				rate: 1,
				expiredAt: 1,
				createdAt: 1
			},
			limit: 1
		});

		if (res === null || res.body.length === 0) {
			return;
		}
		const cer = res.body[0];
		console.log(cer);

		this.setState({ cer });
	}

	_handleSubmit = (values) => {
		const { ApplicationStore } = this.props;
		const _id = this._id;

		const canProcess = this._canGoToNext();
		if (!canProcess)
			return this._showError('Some critical fields are missing');

		Modal.confirm({
			title: 'Are you sure ?',
			content:
				'We will notify the user that the review process is starting.',
			onOk: async () => {
				const startReviewProcess = await ApplicationStore.startReview(
					_id,
					'beginning review'
				);
				if (!startReviewProcess) {
					console.error(startReviewProcess.body);
					return this._showError('server error');
				}

				return Promise.all([
					this._fetchData(),
					this._fetchHistory(),
					this._fetchCertificate()
				]);
			},
			onCancel() {}
		});
	};

	_handleReview = (values) => {
		const { ApplicationStore } = this.props;
		const _id = this._id;
		const { isAccept, comments, ...others } = values;

		Modal.confirm({
			title: 'Are you sure ?',
			content: 'We will notify the user about this decision.',
			onOk: async () => {
				let reviewProcess = null;
				if (isAccept)
					reviewProcess = await ApplicationStore.approveCertificate(
						_id,
						comments,
						others
					);
				else
					reviewProcess = await ApplicationStore.rejectCertificate(
						_id,
						comments,
						others
					);

				if (!reviewProcess) {
					console.error(reviewProcess.body);
					return this._showError('server error');
				}

				return Promise.all([
					this._fetchData(),
					this._fetchHistory(),
					this._fetchCertificate()
				]);
			},
			onCancel() {}
		});
	};

	_canGoToNext() {
		return true;
	}

	render() {
		const { data, history, cer } = this.state;
		const { status } = data;
		const step = STATE_MAPPING[status];

		return (
			<div>
				<Steps current={step}>
					<Step
						title="Waiting Info"
						description="Waiting user input enough infomation"
					/>
					<Step title="In Review" description="KYC Procedure" />
					<Step title="Complete" description="Issue Certified" />
				</Steps>

				<Card
					title="User Information"
					bordered={false}
					style={{
						paddingTop: 20
					}}
				>
					<Row type="flex" justify="space-around">
						{step === 2 &&
						cer && (
							<Col span={6}>
								<CertificateDisplay itm={cer} />
							</Col>
						)}
						{step !== 2 &&
						history && (
							<Col span={6}>
								<Card
									title="History"
									bordered={false}
									style={{
										height: 400
									}}
								>
									<div
										style={{
											height: 300,
											overflowY: 'scroll'
										}}
									>
										<UserActivityHistory
											history={history}
										/>
									</div>
								</Card>
							</Col>
						)}
						<Col span={18}>
							<UserDetailDisplay
								handleSubmit={this._handleSubmit}
								data={data}
								hasNext={step === 0}
							/>
						</Col>
					</Row>
				</Card>

				{step === 1 && (
					<Card
						title="Reviewer Input"
						bordered={false}
						style={{
							paddingTop: 20
						}}
					>
						<ReviewSections
							handleReview={this._handleReview}
							data={data}
						/>
					</Card>
				)}

				{step === 2 && (
					<Card
						title="History"
						bordered={false}
						style={{
							paddingTop: 20
						}}
					>
						<UserActivityHistory history={history} />
					</Card>
				)}
			</div>
		);
	}
}

export default UserDetailPage;
