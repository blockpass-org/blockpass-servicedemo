import React, { Component } from 'react';
import { withRouter } from 'react-router'
import { message, Row } from 'antd';
import { Form, Icon, Input, Button, Select } from 'antd';
import { inject } from 'mobx-react';

import './style.css';

const FormItem = Form.Item;


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
                const { deployKey, adminPass } = values;

                const setupRequest = await ApplicationStore.firstTimeSetup({
                    deployKey,
                    settings: {
                        adminPass
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