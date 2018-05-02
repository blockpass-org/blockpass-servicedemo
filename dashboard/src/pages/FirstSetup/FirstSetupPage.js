import React, { Component } from 'react';
import { withRouter } from 'react-router'
import { message, Row } from 'antd';
import { Form, Icon, Input, Button, Select } from 'antd';
import { inject } from 'mobx-react';

import './style.css';

const FormItem = Form.Item;

const ETHER_NETWORKS = [
    "Rinkeby",
    "MainNet"
]

@inject("ApplicationStore", "Auth")
class FirstSetupPage extends Component {

    componentWillReceiveProps(nextProps) {
        const { history, ApplicationStore } = nextProps;
        if (ApplicationStore.appSetting.length !== 0)
            history.replace('/login');
    }

    _handleSubmit = (e) => {
        const { ApplicationStore, Auth, history } = this.props;

        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {

                console.log(values);
                const { deployKey, adminPass, SmartContractAddress, SmartContractEnv } = values;

                const setupRequest = await ApplicationStore.firstTimeSetup({
                    deployKey,
                    settings: {
                        adminPass,
                        SmartContractAddress,
                        SmartContractEnv
                    }
                })

                if (!setupRequest)
                    return message.error("frist time setup error")

                // message.info('Login Success');
                // history.replace('/');
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { ApplicationStore } = this.props;
        const { hostUrl, isDev } = ApplicationStore;

        return <div className="setupPanel">
            <Row justify="center" type="flex" className="setupPanelHeader" >
                <span className="setupTitle" >First Time Setup</span>
            </Row>
            <Row justify="center" align="middle" type="flex">
                <Form onSubmit={this._handleSubmit} className="setup-form">
                    <FormItem>
                        {getFieldDecorator('deployKey', {
                            rules: [{ required: true, message: 'You can find this on docker-compose or DELOY_SECRET_KEY env' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} autoComplete="off" placeholder="Deployment Key" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('adminPass', {
                            rules: [{ required: true, message: 'Please input your adminPass!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} autoComplete="off" type="password" placeholder="New Admin Pass" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('SmartContractAddress', {
                            rules: [{ required: true, message: 'Please input your SmartContractAddress' }],
                        })(
                            <Input prefix={<Icon type="setting" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="SmartContractAddress" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('SmartContractEnv', {
                            rules: [{ required: true, message: 'Please input your Etherium Networks' }],
                            initialValue: ETHER_NETWORKS[0]
                        })(
                            <Select>
                                {ETHER_NETWORKS.map((itm, i) => {
                                    return <Select.Option key={i} value={itm}> {itm} </Select.Option>
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="setup-form-button">
                            Log in
                        </Button>
                    </FormItem>
                </Form>
            </Row>
        </div>
    }
}

export default withRouter(Form.create()(FirstSetupPage)); 