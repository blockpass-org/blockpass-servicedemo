import React, { PureComponent } from 'react';
import { Button, Icon } from 'antd';
import { CheckboxGroup } from '../../../../../../../../components/StoryBookComponents';
import { Input, Radio } from 'antd';
const { TextArea } = Input;
const { Button: RadioButton, Group: RadioGroup } = Radio;

export default class BodyWithImage extends PureComponent {
	state = {
		reason: '',
		status: '',
		tooltips: [ 'Not clear', 'Wrong format', 'Out of date' ]
	};
	componentDidMount() {
		this.setState({ status: this.props.status, reasonEditor: !this.props.reason });
	}

	/**
 * handle typing event when user type reason
 *
 * @param  {string} reason reason
 *
 */
	_onReasonChange = (reason) => this.setState({ reason });

	/**
 * handle event when user click on checkbox
 *
 * @param  {string} value 'accepted' or 'rejected'
 *
 */
	_onChangeHandle = (value) => {
		if (value === 'approved') {
			this.props.acceptedEvt(this.props.keyName);
			this.props.close();
		} else {
			this.setState({ status: value, reasonEditor: true });
		}
	};
	render() {
		const { reason, tooltips, status } = this.state;
		const {
			disable,
			keyName,
			reason: fieldReason,
			rejectedEvt,
			close,
			inProcess,
			isFirstTimeReview,
			checkDisabledField,
			waitingUserResubmit,
			dataValue
		} = this.props;

		return (
			<div className="modal-image">
				<span className="ant-modal-close-x modal-image-close" />
				<div className="modal-image__image-content">
					<img src={dataValue} alt="img" style={{minWidth: '500px'}}/>
				</div>
				{inProcess !== 'approved' ? (
					<div className="modal-image__controller">
						<div className="modal-image__checkbox-wrapper">
							<CheckboxGroup
								onChangeHandle={this._onChangeHandle}
								checked={status}
								disabled={
									inProcess === 'waiting' ? true : isFirstTimeReview ? false : checkDisabledField
								}
							/>
							<span className="modal-image__label-checkbox accept">Accept</span>
							<span className="modal-image__label-checkbox reject">Reject</span>
						</div>
						{this.state.reasonEditor &&
						status === 'rejected' && (
							<div className={`modal-image__reason-wrapper ${status}`}>
								<div className="modal-image__reason-wrapper-move">
									<h4>GIVE THE REASON</h4>
									<p>Please give the reason why you rejected this field</p>
									<TextArea
										value={reason}
										rows={6}
										placeholder="Type reason here"
										onChange={(e) => this._onReasonChange(e.target.value)}
									/>
									<p
										style={{
											textAlign: 'center'
										}}
									>
										OR
									</p>
									<span>Choose below reason</span>
									<div className="modal-image__wrapper">
										<RadioGroup
											value={this.state.reason}
											onChange={(e) => this._onReasonChange(e.target.value)}
										>
											{tooltips &&
												tooltips.map((item, index) => (
													<RadioButton value={item} key={index}>
														{item}
													</RadioButton>
												))}
										</RadioGroup>
									</div>
									<div className="modal-image__button">
										<Button
											className={`big ${disable}`}
											onClick={() => {
												rejectedEvt(keyName, reason);
												close();
											}}
											disabled={disable}
										>
											SAVE
										</Button>
									</div>
								</div>
							</div>
						)}
						{!this.state.reasonEditor && (
							<div className="modal-image__reason-submitted">
								<h4>Reason</h4>
								<p>{fieldReason}</p>
								<span>
									{!waitingUserResubmit && (
										<Icon
											type="edit"
											onClick={() => this.setState({ reasonEditor: true })}
											className="modal-image-icon"
										/>
									)}
								</span>
							</div>
						)}
					</div>
				) : (
					<div className="modal-image-result approved">
						<Icon type="check-circle-o" />
						<span style={{ marginLeft: '10px' }}>Accepted</span>
					</div>
				)}
			</div>
		);
	}
}
