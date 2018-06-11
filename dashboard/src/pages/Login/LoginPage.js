import React, { Component } from 'react';
import { withRouter } from 'react-router'
import { message, Row } from 'antd';
import { Form, Icon, Input, Button } from 'antd';
import { inject } from 'mobx-react';

import './style.css'

const FormItem = Form.Item;

@inject("ApplicationStore", "Auth")
class LoginPage extends Component {

    componentDidMount() {
        const {history} = this.props;
        history.replace('/login');
    }

    componentWillReceiveProps(nextProps) {
        const { history, ApplicationStore } = nextProps;
        if (ApplicationStore.appSetting.length === 0)
            history.replace('/setup');
    }

    _handleSubmit = (e) => {
        const { ApplicationStore, Auth, history } = this.props;
        const { isDev } = ApplicationStore;


        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {

                // Update host
                if (isDev)
                    ApplicationStore.setHost(values.host);

                const tokenInfo = await ApplicationStore.login(values.userName, values.password);
                if (!tokenInfo)
                    return message.error('Login failed');
                
                Auth.setToken(tokenInfo.token, tokenInfo.expire)
                Auth.setPermission(tokenInfo.scope);

                message.info('Login Success');
                history.replace('/');
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { ApplicationStore } = this.props;
        const { hostUrl, isDev } = ApplicationStore;

        return <div className="loginPanel">
            <Row justify="center" type="flex" className="loginPanelHeader" >
                <span className="loginTitle" >Dashboard</span>
            </Row>
            <Row justify="center" align="middle" type="flex">
                <Form onSubmit={this._handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    { isDev && <FormItem>
                        {getFieldDecorator('host', {
                            initialValue: hostUrl
                        })(
                            <Input prefix={<Icon type="link" />} placeholder={ hostUrl } />
                        )}
                        </FormItem>
                    }
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </FormItem>
                </Form>
            </Row>
        </div>
    }
}

export default withRouter(Form.create()(LoginPage)); 