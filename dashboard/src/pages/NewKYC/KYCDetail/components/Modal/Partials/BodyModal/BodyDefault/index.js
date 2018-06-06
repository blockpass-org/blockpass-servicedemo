import React from 'react';
import { Input, Radio } from 'antd';
const { TextArea } = Input;
const { Button: RadioButton, Group: RadioGroup } = Radio;

const BodyDefault = ({ textEvtHandle, value, tooltips }) => (
	<div className="modal-body__wrapper">
		<div className="modal-body__text-area">
			<TextArea onChange={(e) => textEvtHandle(e.target.value)} value={value} />
		</div>
		<div className="modal-body__devider">
			<p>
				<span>or</span>Choose below tags
			</p>
		</div>
		<div className="modal-body__radio">
			<RadioGroup onChange={(e) => textEvtHandle(e.target.value)} value={value}>
				{tooltips &&
					tooltips.map((item, index) => (
						<RadioButton value={item} key={index}>
							{item}
						</RadioButton>
					))}
			</RadioGroup>
		</div>
	</div>
);

export default BodyDefault;
