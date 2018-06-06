import React from 'react';
import { Icon } from 'antd';

const HeaderDefault = ({ title, description, type, backEvt, close, value, onSubmit }) => (
	<div className={`modal-header__wrapper  ${type}`}>
		<h2 className="modal-header__title">
			{type === 'confirm' && (
				<span
					onClick={() => {
						close();
						onSubmit(type);
					}}
					className="icon-back"
				>
					<Icon type="arrow-left" />
				</span>
			)}
			{title}
		</h2>
		<h3 className="modal-header__description">{description}</h3>
	</div>
);

export default HeaderDefault;
