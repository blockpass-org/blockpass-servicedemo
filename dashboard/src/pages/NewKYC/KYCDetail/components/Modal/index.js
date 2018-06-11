import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MAP_KEYWORDS } from '../../../map_constant';

import { DefaultModal, InfoModal, ApproveConfirmModal, HistoryModal, ImageModal } from './HOC';
import './modal.scss';

const IS_REACT_16 = !!ReactDOM.createPortal;

const modalDefaultProps = {
	approval: {
		modalTitle: 'CERTIFICATE GENERATION',
		tooltips: [
			'User onboarded successfully',
			'User information have been thoroughly verified.',
			'The selfie matches the picture on the passport.'
		]
	},
	'send-feedback': {
		modalTitle: 'SUBMIT FEEDBACK TO USER',
		tooltips: [
			'Some field have been rejected, please see details.',
			'Pictures are not clear enough.',
			'You must be at least 18 years to use our service.'
		]
	},
	rejected: {
		modalTitle: 'EXPLAIN REASON FOR REJECTION',
		fieldChecking: (title) => MAP_KEYWORDS[title],
		tooltips: [
			'Data seems to be fake.',
			'Picture not clear.',
			'Information does not match the passport',
			'US Residents are not allowed to use the service'
		]
	},
	info: {
		modalTitle: 'Confirm'
	},
	history: {
		historyTitle: (title) => `History of ${MAP_KEYWORDS[title]}`
	}
};

export function renderModal(config) {
	let div = document.createElement('div');
	function close(args = {}) {
		if (IS_REACT_16) {
			render({
				...config,
				close,
				visible: false,
				afterClose: destroy.bind(this, ...args)
			});
		} else {
			destroy(args);
		}
	}
	function destroy(args) {
		const unmountResult = ReactDOM.unmountComponentAtNode(div);
		if (unmountResult && div.parentNode) {
			div.parentNode.removeChild(div);
		}
		const triggerCancel = args && args.length && args.some((param) => param && param.triggerCancel);
		if (config.onCancel && triggerCancel) {
			config.onCancel(...args);
		}
	}
	function render(props) {
		switch (props.type) {
			case 'rejected':
			case 'approval':
			case 'send-feedback':
				ReactDOM.render(
					<DefaultModal
						{...props}
						{...modalDefaultProps[props.type]}
						modalDescription={
							props.itemChecking ? modalDefaultProps['rejected'].fieldChecking(props.itemChecking) : false
						}
						className="modal-kyc-detail modal-default"
						onCancel={destroy.bind(this)}
						close={destroy.bind(this)}
					/>,
					div
				);
				break;
			case 'confirm':
				ReactDOM.render(
					<ApproveConfirmModal
						{...props}
						className="modal-kyc-detail modal-confirm"
						onCancel={destroy.bind(this)}
						close={destroy.bind(this)}
					/>,
					div
				);
				break;
			case 'zoom':
				ReactDOM.render(
					<ImageModal
						{...props}
						className="modal-kyc-detail modal-zoom"
						onCancel={destroy.bind(this)}
						close={destroy.bind(this)}
					/>,
					div
				);
				break;
			case 'info':
				ReactDOM.render(
					<InfoModal
						{...props}
						className="modal-kyc-detail modal-info"
						onCancel={destroy.bind(this)}
						close={destroy.bind(this)}
						{...modalDefaultProps[props.type]}
					/>,
					div
				);
				break;
			default:
				ReactDOM.render(
					<HistoryModal
						{...props}
						onCancel={destroy.bind(this)}
						close={destroy.bind(this)}
						className="modal-kyc-detail modal-history"
						modalTitle={
							props.itemChecking ? modalDefaultProps['history'].historyTitle(props.itemChecking) : ''
						}
					/>,
					div
				);
				break;
		}
	}

	render({
		...config,
		visible: true,
		close
	});
	return { destroy: close };
}

export { DefaultModal, InfoModal, ApproveConfirmModal, HistoryModal };
