import React from 'react';
import { Form, Input, Button, Row, Col, Select, message, Divider, Icon } from "antd";
import MetaMaskRequire from '../../components/MetaMaskRequire/MetaMaskRequire';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
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

const ETHER_NETWORKS = [
    "Rinkeby",
    "MainNet"
]
class DynamicForm extends React.Component {
    _renderFormItem = (label, initialValue = '', optional) =>  {
        const formComponent = {
            input: (label) => <Input autoComplete="off" placeholder={label}/>,
            select: () =>   <Select>
                                {ETHER_NETWORKS.map((itm, i) => {
                                    return <Select.Option key={i} value={itm}> {itm} </Select.Option>
                                })}
                            </Select>,
            textArea: (label) => <TextArea autoComplete="off" placeholder={label}/>,
        }

        return ({
            fieldName: `${label}`,
            displayName: label,
            initialValue: initialValue,
            rules: [{}],
            onCustomRender: _ => formComponent[`${optional}`](label),
        })
    }

    _onSubmit = (e) => {
        const _id = this.props.data._id;

        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return;
            }
            this.props.onSubmitHandle({id: _id, values})
        });
    }

    render() {
        const { form: {getFieldDecorator}, data} = this.props;
        const {label: title, fields} = data
        const formfields = fields.reduce((acc, item) => {
            if (item._display.hidden)
                return acc;
            acc.push(this._renderFormItem(item._id, item.value, item._display.type))
            return acc
        },[])
        return(
            <Form
                layout="vertical"
                onSubmit={this._onSubmit}
                className="account-setting"
                key={title}
            >
                <Divider>{title}</Divider>
                {
                    formfields.map((fieldInfo, i) => {
                        const { fieldName, displayName, rules, onCustomRender, ...extraConfig } = fieldInfo;
                        const displayComp = onCustomRender(data);

                        return <FormItem key={i} label={`${displayName}`} {...formItemLayout} >
                            {getFieldDecorator(`${fieldName}`, {
                                rules: rules || [],
                                ...extraConfig
                            })(
                                displayComp
                            )}
                        </FormItem>
                    })
                }
                {<Row type="flex" justify="end">
                    <Col xs={{span:24}} sm={{span:12}} md={{span:6}}>
                        <Button
                            type="primary" htmlType="submit"
                            className="account-setting__button"
                        >
                            Update information
                        </Button>
                    </Col>
                </Row>}
            </Form>
        )
    }
}

export default Form.create()(DynamicForm);