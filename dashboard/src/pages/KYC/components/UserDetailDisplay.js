import React from 'react';
import { Form, Input, Button, Avatar } from 'antd';
import { translatePictureUrl } from '../../../utils';

const FormItem = Form.Item;

const FORM_FIELDS = [
    {
        fieldName: 'photo',
        displayName: 'Photo',
        onCustomRender: (data) => {
            const url = data.picture ? translatePictureUrl(data.picture) : `${process.env.PUBLIC_URL}/no-image.jpg`
            console.log(url);
            return <Avatar shape="square" size='large' src={url} style={{
                width: 200,
                height: 200
            }} />
        }
    },
    {
        fieldName: '_id',
        displayName: 'ID',
        onCustomRender: _ => <Input disabled />,
    },
    {
        fieldName: 'blockPassID',
        displayName: 'BlockPassID',
        onCustomRender: _ => <Input disabled />,
    },
    {
        fieldName: 'fristName',
        displayName: 'FirstName',
        validateFirst: true,
        rules: [{
            required: true
        }],
        onCustomRender: _ => <Input readOnly />,
    },
    {
        fieldName: 'lastName',
        displayName: 'LastName',
        validateFirst: true,
        rules: [{
            required: true
        }],
        onCustomRender: _ => <Input readOnly />,
    },
    {
        fieldName: 'email',
        displayName: 'Email',
        validateFirst: true,
        rules: [{
            type: 'email',
            required: true
        }],
        placeholder: "Input a email",
        onCustomRender: _ => <Input readOnly />,
    },
    {
        fieldName: 'phone',
        displayName: 'Phone',
        validateFirst: true,
        rules: [{
            type: 'string',
            pattern: /[0-9]+/,
            message: 'Must be valid phone',
            required: true

        }],
        placeholder: "Input a number",
        onCustomRender: _ => <Input readOnly />,
    },
    {
        fieldName: 'passport',
        displayName: 'Passport',
        onCustomRender: (data) => {
            const url = data.picture ? translatePictureUrl(data.passport) : `${process.env.PUBLIC_URL}/no-image.jpg`
            console.log(url);
            return <Avatar shape="square" size='large' src={url} style={{
                width: 100,
                height: 100
            }} />
        }
    },
    {
        fieldName: 'proofOfAddress',
        displayName: 'ProofOfAddress',
        onCustomRender: (data) => {
            const url = data.picture ? translatePictureUrl(data.proofOfAddress) : `${process.env.PUBLIC_URL}/no-image.jpg`
            console.log(url);
            return <Avatar shape="square" size='large' src={url} style={{
                width: 100,
                height: 100
            }} />
        }
    },
    {
        fieldName: 'onfidoCertificate',
        displayName: 'OnfidoCertificate',
        validateFirst: true,
        rules: [],
        onCustomRender: val => <Input.TextArea readOnly autosize={{ minRows: 2, maxRows: 6 }}/>
    },
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
};

class UserDetailDisplay extends React.PureComponent {
    
    _handleSubmit = (e) => {
        const { handleSubmit } = this.props;
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                handleSubmit && handleSubmit(values);
            }
        });
    }

    render() {
        const { data } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { hasNext } = this.props;

        return <Form onSubmit={this._handleSubmit}  >
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
            {hasNext && <FormItem>
                    <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                        Start Review
                    </Button>
                </FormItem>
            }
        </Form>
    }
}

export default Form.create()(UserDetailDisplay);