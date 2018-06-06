import React from 'react';
import { FooterDefault, HeaderDefault } from '../../Partials';
import enhanceModal from '../../enhancer';
import { Modal } from 'antd';

const ApprovalConfirmContent = ({ value }) => (
	<div className="modal-approve-confirm__body">
		<p>{value}</p>
	</div>
);

const WrapperComponent = enhanceModal({
	header: HeaderDefault,
	body: ApprovalConfirmContent,
	footer: FooterDefault
})(Modal);

const ApproveConfirmModal = (props) => <WrapperComponent {...props} />;

export default ApproveConfirmModal;
