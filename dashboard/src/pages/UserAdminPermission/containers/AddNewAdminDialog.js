import React from 'react';
import { Form, Input, Modal } from "antd";
import PermissionScopeTag from "../components/PermissionScopeTag";
const FormItem = Form.Item;

const FORM_FIELDS = [
    {
        fieldName: 'userName',
        displayName: 'UserName',
        rules: [{
            required: true, message: 'Please input your this!',
        }],
        onCustomRender: _ => <Input/>,
    },
    {
        fieldName: 'pass',
        displayName: 'Password',
        rules: [{
            required: true, message: 'Please input your this!',
        }],
        onCustomRender: _ => <Input type="password"/>,
    },
    {
        fieldName: 'dup_pass',
        displayName: 'Repeat Password',
        rules: [{
            required: true, message: 'Please input your this!',
        }],
        onCustomRender: _ => <Input type="password"/>,
    },
    {
        fieldName: 'scope',
        displayName: 'Scopes',
        onCustomRender: _ => <PermissionScopeTag />,
    }
]

const formItemLayout = {}

class AddNewAdminDialog extends React.PureComponent {
    render() {
        const { visible, onCancel, onCreate, form, data } = this.props;
        const { getFieldDecorator } = form;
        return <Modal
            visible={visible}
            title="Create New User"
            okText="Submit"
            onCancel={onCancel}
            onOk={onCreate}
        >
            <Form layout="vertical">
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
            </Form>
        </Modal>
    }
}

export default Form.create()(AddNewAdminDialog);