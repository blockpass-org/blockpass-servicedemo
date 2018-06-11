import React from 'react';
import { HeaderDefault } from '../../Partials';
import enhanceModal from '../../enhancer';
import { Modal, Button } from 'antd';

const InfoSubmitArea = ({ onCancel, onSubmit, close }) => (
	<div className="modal-info__footer">
		<div className="modal-info__button-wrapper">
			<Button className="small black" onClick={() => onCancel()}>
				NO
			</Button>
			<Button
				className="small"
				onClick={() => {
					close();
					onSubmit();
				}}
			>
				YES
			</Button>
		</div>
	</div>
);

const InfoContent = () => (
	<div className="modal-info__body">
		<p>Are you sure that you don't want to issue a certificate to user ?</p>
	</div>
);

const WrapperComponent = enhanceModal({
	header: HeaderDefault,
	body: InfoContent,
	footer: InfoSubmitArea
})(Modal);

const InfoModal = (props) => <WrapperComponent {...props} className="modal-kyc-detail modal-info" />;

export default InfoModal;
