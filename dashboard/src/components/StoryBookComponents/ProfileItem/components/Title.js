import React from 'react';
import { Row } from 'antd';

const Title = ({ title }) => (
	<Row className="profile-item__content-wrapper">
		<span className="profile-item__title">{title}</span>
	</Row>
);
export default Title;
