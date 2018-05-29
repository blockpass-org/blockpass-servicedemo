import React from 'react';
import { PropTypes } from 'prop-types';
import { Steps } from 'antd';

const { Step } = Steps;

const stepData = [
	{
		step: 0,
		title: 'Waiting For Review'
	},
	{
		step: 1,
		title: 'In Review'
	},
	{
		step: 2,
		title: 'Result'
	}
];

const STATE_MAPPING = {
	waiting: 0,
	inreview: 1,
	approved: 2
};

const StepComponent = ({ status, data = stepData }) => (
	<Steps progressDot current={STATE_MAPPING[status]}>
		{data.map((item, index) => <Step title={item.title} key={index} />)}
	</Steps>
);

StepComponent.propTypes = {
	status: PropTypes.string.isRequired,
	data: PropTypes.array
};

export default StepComponent;
