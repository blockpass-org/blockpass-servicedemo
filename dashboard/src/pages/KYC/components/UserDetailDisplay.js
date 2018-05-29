import React from 'react';
import moment from "moment";
import {Form, Input, Button, Avatar} from 'antd';
import {translatePictureUrl, getObjectValueFromPath} from '../../../utils';

const FormItem = Form.Item;

const FORM_FIELDS = [
    {
        fieldName: 'identities.picture',
        displayName: 'Photo',
        onCustomRender: (data) => {
            const url = data
                ? translatePictureUrl(data)
                : `${process.env.PUBLIC_URL}/no-image.jpg`
            return <Avatar
                shape="square"
                size='large'
                src={url}
                style={{
                width: 200,
                height: 200
            }}/>
        }
    }, {
        fieldName: '_id',
        displayName: 'ID',
        onCustomRender: _ => <Input disabled/>
    }, {
        fieldName: 'blockPassID',
        displayName: 'BlockPassID',
        onCustomRender: _ => <Input disabled/>
    }, {
        fieldName: 'createdAt',
        displayName: 'Registration Date',
        transformValue: (value) => {
            return moment(value)
                .local()
                .format('YYYY-MM-DD HH:mm:ss')
        },
        onCustomRender: date => <Input readOnly/>
    }, {
        fieldName: 'identities.fristName',
        displayName: 'FirstName',
        validateFirst: true,
        rules: [
            {
                message: 'Must be valid name'
            }
        ],
        onCustomRender: _ => <Input readOnly/>
    }, {
        fieldName: 'identities.lastName',
        displayName: 'LastName',
        validateFirst: true,
        rules: [
            {
                message: 'Must be valid name'
            }
        ],
        onCustomRender: _ => <Input readOnly/>
    }, {
        fieldName: 'identities.dob',
        displayName: 'Birthday',
        validateFirst: true,
        rules: [
            {
                message: 'Must be valid birthday'
            }
        ],
        onCustomRender: _ => <Input readOnly/>
    }, {
        fieldName: 'identities.address',
        displayName: 'Address',
        validateFirst: true,
        rules: [
            {
                message: 'Must be valid address'
            }
        ],
        onCustomRender: _ => <Input readOnly/>
    }, {
        fieldName: 'identities.email',
        displayName: 'Email',
        validateFirst: true,
        rules: [
            {
                type: 'email',
                message: 'Must be valid email'
            }
        ],
        placeholder: "Input a email",
        onCustomRender: _ => <Input readOnly/>
    }, {
        fieldName: 'identities.phone',
        displayName: 'Phone',
        validateFirst: true,
        rules: [
            {
                type: 'string',
                pattern: /[0-9]+/,
                message: 'Must be valid phone'
            }
        ],
        placeholder: "Input a number",
        onCustomRender: _ => <Input readOnly/>
    }, {
        fieldName: 'identities.passport',
        displayName: 'Passport',
        onCustomRender: (data) => {
            const url = (data)
                ? translatePictureUrl(data)
                : `${process.env.PUBLIC_URL}/no-image.jpg`
            return <Avatar
                shape="square"
                size='large'
                src={url}
                style={{
                width: 100,
                height: 100
            }}/>
        }
    }, {
        fieldName: 'identities.proofOfAddress',
        displayName: 'ProofOfAddress',
        onCustomRender: (data) => {
            const url = (data)
                ? translatePictureUrl(data)
                : `${process.env.PUBLIC_URL}/no-image.jpg`
            return <Avatar
                shape="square"
                size='large'
                src={url}
                style={{
                width: 100,
                height: 100
            }}/>
        }
    }, {
        fieldName: 'certs.onfidoCertificate',
        displayName: 'OnfidoCertificate',
        validateFirst: true,
        rules: [],
        onCustomRender: val => <Input.TextArea
                readOnly
                autosize={{
                minRows: 2,
                maxRows: 6
            }}/>
    }
]

const formItemLayout = {
    labelCol: {
        xs: {
            span: 18
        },
        sm: {
            span: 5
        }
    },
    wrapperCol: {
        xs: {
            span: 18
        },
        sm: {
            span: 12
        }
    }
};

class UserDetailDisplay extends React.PureComponent {

    _handleSubmit = (e) => {
        const {handleSubmit} = this.props;
        e.preventDefault();
        this
            .props
            .form
            .validateFields(async(err, values) => {
                if (!err) {
                    handleSubmit && handleSubmit(values);
                }
            });
    }

    render() {
        const {data} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {hasNext} = this.props;
        return <Form onSubmit={this._handleSubmit}>
            {data && data.identities && FORM_FIELDS.map((fieldInfo, i) => {
                const {
                    fieldName,
                    displayName,
                    rules,
                    onCustomRender,
                    ...extraConfig
                } = fieldInfo;

                let initialValue = getObjectValueFromPath(data, fieldName);

                if (fieldInfo.transformValue) 
                    initialValue = fieldInfo.transformValue(initialValue);
                
                const displayComp = onCustomRender(initialValue);

                return <FormItem key={i} label={`${displayName}`} {...formItemLayout}>
                    {getFieldDecorator(`${fieldName}`, {
                        rules: rules || [],
                        initialValue: initialValue,
                        ...extraConfig
                    })(displayComp)}
                </FormItem>
            })
}
            {hasNext && <FormItem>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                    float: 'right'
                }}>
                    Start Review
                </Button>
            </FormItem>
}
        </Form>
    }
}

export default Form.create()(UserDetailDisplay);