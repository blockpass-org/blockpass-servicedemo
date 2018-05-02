import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, message, Divider } from "antd";
import { inject } from 'mobx-react';
import PermissionScopeTag from "./components/PermissionScopeTag";
const FormItem = Form.Item;

const MODEL_NAME = 'AdminUserModel';
const FORM_FIELDS = [
    {
        fieldName: 'userName',
        displayName: 'UserName',
        rules: [{
            required: true, message: 'Please input your this!',
        }],
        onCustomRender: _ => <Input disabled/>,
    },
    {
        fieldName: 'scope',
        displayName: 'Scopes',
        onCustomRender: _ => <PermissionScopeTag />,
    }
]
const formItemLayout = {
    labelCol: {
        xs: { span: 18 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 18 },
        sm: { span: 12 },
    },
}

@inject("ApplicationStore")
class UserAdminDetail extends Component {
    state = {
        data: {
            scope: []
        }
    }
    componentDidMount() {
        const { match } = this.props;
        this._id = match.params.id;
        this._fetchData();
    }

    async _fetchData() {
        const { ApplicationStore } = this.props;
        const _id = this._id;

        const res = await ApplicationStore.restQueryData(MODEL_NAME, {
            query: {
                _id
            }
        });

        if (res === null || res.body.length === 0) {
            return this._showError('Data not found!');
        }

        const data = res.body[0];
        console.log(data);

        this.setState({ data })
    }

    _onSubmit = (e) => {
        const { ApplicationStore } = this.props;
        const _id = this._id;

        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            console.log(values);
            const res = await ApplicationStore.restUpdateData(MODEL_NAME, {
                _id,
                ...values
            });
            if(!res) {
                return message.error('Update data error');
            }

            message.success('update data completed')
            this._fetchData();

        });
    }

    render() {
        const { form } = this.props;
        const { data } = this.state;
        const { getFieldDecorator } = form;
        return <Form
            layout="vertical"
            onSubmit={this._onSubmit}
        >
                <Divider>General Info</Divider>
            {
                FORM_FIELDS.map((fieldInfo, i) => {
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
                <Col span={4}>
                    <Button
                        type="primary" htmlType="submit"
                    >
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
    }
}

export default Form.create()(UserAdminDetail);