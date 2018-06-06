import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MAP_KEYWORDS } from '../../../map_constant';

import { DefaultModal, InfoModal, ApproveConfirmModal, HistoryModal } from './HOC';
import './modal.scss';

const IS_REACT_16 = !!ReactDOM.createPortal;

const modalDefaultProps = {
	approval: {
		modalTitle: 'CERTIFICATE GENERATION',
		tooltips: [ 'Your profile is clear.', 'Your information are authenticated.', 'You passed our review.' ]
	},
	'send-feedback': {
		modalTitle: 'FEEDBACK TO USER',
		tooltips: [
			'We need your update on the profile.',
			'Some information are not clear.',
			'Please see details at each rejected field.'
		]
	},
	rejected: {
		modalTitle: 'GIVE ME THE REASON',
		fieldChecking: (title) => MAP_KEYWORDS[title],
		tooltips: [ 'This is not clear.', 'This could not be found.', 'This is out of date.' ]
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
	div.id = 'kyc-modal';
	document.body.appendChild(div);
	function close(args = {}) {
		if (IS_REACT_16) {
			render({ ...config, close, visible: false, afterClose: destroy.bind(this, ...args) });
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
						onCancel={destroy.bind(this)}
						close={destroy.bind(this)}
					/>,
					document.getElementById('kyc-modal')
				);
				break;
			case 'confirm':
				ReactDOM.render(
					<ApproveConfirmModal {...props} onCancel={destroy.bind(this)} close={destroy.bind(this)} />,
					div
				);
				break;
			case 'info':
				ReactDOM.render(
					<InfoModal
						{...props}
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
						className="modal-history"
						modalTitle={
							props.itemChecking ? modalDefaultProps['history'].historyTitle(props.itemChecking) : ''
						}
					/>,
					div
				);
				break;
		}
	}

	render({ ...config, visible: true, close });
	return {
		destroy: close
	};
}

export { DefaultModal, InfoModal, ApproveConfirmModal, HistoryModal };
