import React, { Component } from 'react';
import { Tag, Button, message } from 'antd';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import AddNewAdminDialog from './containers/AddNewAdminDialog';
import DataEntitiesTableAdvance from '../../components/DataEntitiesTable/DataEntitiesTableAdvance';

const MODEL_NAME = 'AdminUserModel';
const selectFields = {
	_id: 1,
	userName: 1,
	scope: 1
};
const SCOPE_COLOR_MAPPING = {};

const columns = [
	{
		title: 'ID',
		dataIndex: '_id',
		customFilter: true,
		render: (data) => {
			return <div>{data.slice(0, 5) + '...'}</div>;
		},
		width: '20%'
	},
	{
		title: 'UserName',
		dataIndex: 'userName',
		customFilter: true
	},
	{
		title: 'Scope',
		dataIndex: 'scope',
		render: (scopes) => {
			return (
				<div>
					{scopes.map((data, i) => (
						<Tag key={i} color={SCOPE_COLOR_MAPPING[data]}>
							{data}
						</Tag>
					))}
				</div>
			);
		}
	},
	{
		title: 'Action',
		key: 'action',

		render: (text, record) => (
			<div>
				<Link to={`/permission/${record._id}`}>Edit</Link>
			</div>
		)
	}
];

@inject('ApplicationStore')
export default class UserPage extends Component {
	_refreshData = async (queryModel) => {
		const { ApplicationStore } = this.props;
		queryModel = {
			...queryModel,
			query: {
				...queryModel.query
			}
		};

		// apply select fields
		return await ApplicationStore.restQueryData(MODEL_NAME, {
			...queryModel,
			select: selectFields
		});
	};

	_createNew = async (modelData) => {
		const { ApplicationStore } = this.props;

		// apply select fields
		return await ApplicationStore.restCreateData(MODEL_NAME, {
			...modelData
		});
	};

	state = {
		visible: false
	};

	_showModal = () => {
		this.setState({ visible: true });
	};

	_handleCancel = () => {
		this.setState({ visible: false });
	};

	_handleCreate = async () => {
		const form = this.formRef.props.form;
		form.validateFields(async (err, values) => {
			if (err) {
				return;
			}

			if (values.pass !== values.dup_pass) {
				return message.warning('Password miss matching');
			}

			console.log('Received values of form: ', values);
			form.resetFields();
			this.setState({ visible: false });

			const res = await this._createNew(values);
			if (!res) {
				message.error("Can't create user");
			} else {
				await this._tableRef.fetchData();
			}
		});
	};

	_saveFormRef = (formRef) => {
		this.formRef = formRef;
	};

	/**
 * redirect to KYC detail
 *
 * @param  {string} id id of kyc
 *
 */
	_redirect = (id) => {
		const { history } = this.props;
		history.push(`/permission/${id}`);
	};

	render() {
		return (
			<div
				style={{
					padding: '20px',
					backgroundColor: 'white',
					position: 'relative'
				}}
			>
				<Button
					icon="plus"
					onClick={this._showModal}
					style={{
						margin: '0 20px',
						width: '50px',
						height: '50px',
						borderRadius: '50%',
						fontSize: '30px',
						fontWeight: '900',
						position: 'fixed',
						bottom: '50px',
						right: '50px'
					}}
				/>

				<DataEntitiesTableAdvance
					ref={(tableRef) => (this._tableRef = tableRef)}
					columns={columns}
					refreshData={this._refreshData}
					onRowClickEvent={this._redirect}
				/>
				<AddNewAdminDialog
					wrappedComponentRef={this._saveFormRef}
					visible={this.state.visible}
					onCancel={this._handleCancel}
					onCreate={this._handleCreate}
					data={{
						scope: [ 'reviewer' ]
					}}
				/>
			</div>
		);
	}
}
