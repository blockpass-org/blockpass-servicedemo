import React, { Fragment } from 'react';
import {
	message,
} from 'antd';
import { inject } from 'mobx-react';
import DynamicForm from '../../components/DynamicForm';

import './index.scss';

@inject('ApplicationStore', 'Auth')
class AccountSettingPage extends React.Component {
	state = {
		data: {}
	};

	componentDidMount() {
		this._fetchData();
	}

	_showError(msg) {
		message.error(msg);
	}

	_onSubmitHandle = async (data) => {
		const { ApplicationStore } = this.props;
		const res = await ApplicationStore.updateSetting(data);
		if (!res) {
			return message.error('Update data error');
		} else {
			const data = [
				...this.state.data.filter(
					(setting) => setting.label !== res.body.label
				),
				res.body
			];
			this.setState({ data }, () =>
				message.success('Your setting has been updated !')
			);
		}
	};

	async _fetchData() {
		const { ApplicationStore } = this.props;
		const res = await ApplicationStore.querySetting();

		if (res === null || res.body.length === 0) {
			return this._showError('Data not found!');
		}
		const data = res.body;
		this.setState({ data });
	}

	render() {
		const { data } = this.state;
		return (
			<div style={{ display: 'flex' }}>
				<div
					style={{
						width: '75%',
						marginLeft: '16.66666667%',
						backgroundColor: 'white',
						padding: '20px',
						minHeight: '100vh'
					}}
				>
					<Fragment>
						{data.length > 0 &&
							data.map((item, index) => (
								<DynamicForm
									data={item}
									key={index}
									onSubmitHandle={this._onSubmitHandle}
								/>
							))}
					</Fragment>
				</div>
			</div>
		);
	}
}

export default AccountSettingPage;
