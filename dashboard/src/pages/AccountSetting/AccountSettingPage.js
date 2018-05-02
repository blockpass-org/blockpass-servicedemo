import React from 'react';
import { Form, Input, Button, Row, Col, message, Divider } from "antd";
import { inject } from 'mobx-react';
import MetaMaskRequire from '../../components/MetaMaskRequire/MetaMaskRequire';

import './index.scss';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
        md: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 18 }
    },
}


@inject("ApplicationStore", "Auth")
class AccountSettingPage extends React.Component {
    state = {
        data: {}
    }

    FORM_FIELDS = [
        {
            fieldName: 'userName',
            displayName: 'UserName',
            onCustomRender: _ => <Input disabled />,
        },
        {
            fieldName: 'pass',
            displayName: 'Password',
            rules: [{
                required: true, message: 'Please input this!',
            }],
            onCustomRender: _ => <Input type="password" />,
        },
        {
            fieldName: 'dup_pass',
            rules: [
                { required: true, message: 'Please input this!' },
                {
                    validator: (rule, value, callback) => {
                        const form = this.props.form;
                        if (value && value !== form.getFieldValue('pass')) {
                            callback('Two passwords that you enter is inconsistent!');
                        } else {
                            callback();
                        }
                    }
                }
            ],
            displayName: 'Repeat Password',
            onCustomRender: _ => <Input type="password" />,
        }
    ]

    componentDidMount() {
        this._fetchData();
    }

    _showError(msg) {
        message.error(msg)
    }

    async _fetchData() {
        const { ApplicationStore } = this.props;

        const res = await ApplicationStore.getProfileSetting();

        if (res === null || res.body.length === 0) {
            return this._showError('Data not found!');
        }

        const data = res.body;
        console.log(data);

        this.setState({ data })
    }

    _onSubmit = (e) => {
        const { ApplicationStore, Auth } = this.props;
        const _id = this._id;

        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            const res = await ApplicationStore.updatePassword(values.pass);
            if(!res) {
                return message.error('Update data error');
            }

            message.success('update your password complete. Please login again')
            if (ApplicationStore.logout()) {
                Auth.clearState();
            }
        });
    }

    render() {
        const { form } = this.props;
        const { data, isOperator, myAddress, isReady } = this.state;
        const { getFieldDecorator } = form;

        return <Form
            layout="vertical"
            onSubmit={this._onSubmit}
            className="account-setting"
        >
            <Divider>General Settings</Divider>
            {
                this.FORM_FIELDS.map((fieldInfo, i) => {
                    const { fieldName, displayName, rules, onCustomRender, ...extraConfig } = fieldInfo;

                    let initialValue = data[fieldName];
                    const displayComp = onCustomRender(data);

                    return <FormItem key={i} label={`${displayName}`} {...formItemLayout} >
                        {getFieldDecorator(`${fieldName}`, {
                            rules: rules || [],
                            initialValue: initialValue,
                            ...extraConfig
                        })(
                            displayComp
                        )}
                    </FormItem>
                })
            }
            <Row type="flex" justify="end">
                <Col xs={{span:24}} sm={{span:12}} md={{span:6}}>
                    <Button
                        type="primary" htmlType="submit"
                        className="account-setting__button"
                    >
                        Update Password
                    </Button>
                </Col>
            </Row>
        </Form>
    }
}

export default Form.create()(AccountSettingPage);