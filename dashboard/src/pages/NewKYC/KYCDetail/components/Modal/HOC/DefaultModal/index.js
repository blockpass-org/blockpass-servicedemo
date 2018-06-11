import React, { Component } from 'react';
import { HeaderDefault, BodyDefault, FooterDefault } from '../../Partials';
import enhanceModal from '../../enhancer';
import { Modal } from 'antd';

const WrapperModal = enhanceModal({
	header: HeaderDefault,
	body: BodyDefault,
	footer: FooterDefault
})(Modal);

class DefaultModal extends Component {
	state = {
		value: ''
	};

	componentDidMount() {
		this.setState({ value: this.props.value || '' });
	}

	textEvtHandle = (value) => this.setState({ value }, () => this.props.getModalValue(this.state.value));

	_onSubmit = (value) => this.props.onSubmit(value);
	_afterClose = () => this.setState({ value: '' });

	render() {
		const { value } = this.state;
		return (
			<WrapperModal
				{...this.props}
				value={value}
				textEvtHandle={this.textEvtHandle}
				disable={this.state.value.length === 0}
				onSubmit={this.props.onSubmit}
				type={this.props.type}
				afterClose={this._afterClose}
				reviewValue={this.state.value}
			/>
		);
	}
}

export default DefaultModal;
