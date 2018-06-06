import React from 'react';
import classnames from 'classnames';
import { Button } from 'antd';

const Footer = ({ disable, onSubmit, type, close }) => {
	const btnClassname = classnames('big', {
		disable: disable,
		pink: type === 'rejected',
		blue: type === 'send-feedback'
	});
	return (
		<div className="modal-footer">
			<Button
				className={btnClassname}
				onClick={() => {
					onSubmit(type === 'confirm' ? 'accepted' : type);
					close();
				}}
				disabled={disable}
			>
				{type === 'rejected' ? 'SAVE' : 'SEND TO USER'}
			</Button>
		</div>
	);
};

const CertificateFooter = ({ disable, nextEvt, reviewValue, close, skipEvt }) => (
	<div className="modal-footer approval">
		<Button
			className={`big ${disable ? 'disable' : ''}`}
			onClick={() => {
				close();
				nextEvt();
			}}
			disabled={disable}
		>
			NEXT
		</Button>
		<Button
			className="big black"
			onClick={() => {
				close();
				skipEvt();
			}}
		>
			SKIP
		</Button>
	</div>
);

const FooterDefault = (props) => (props.type === 'approval' ? <CertificateFooter {...props} /> : <Footer {...props} />);

export default FooterDefault;
