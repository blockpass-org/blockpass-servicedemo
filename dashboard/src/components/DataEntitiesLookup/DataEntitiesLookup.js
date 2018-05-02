import React from 'react';
import { Form, Row, Col, Input, Button, Select, Checkbox } from 'antd';
import { camelize } from '../../utils';

import './style.css';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemDefaultLayout = {
    labelCol: {
        span: 2
    },
    wrapperCol: {
        span: 8
    },
};

const DataEntitySelectFields = (placeholder, selectValues = []) => {
    return (<Select
        showSearch
        placeholder={placeholder}
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
        {
            selectValues.map((itm, i) => <Option key={i} value={itm}>{camelize(itm)}</Option>)
        }
    </Select>)
}


class DataEntitiesSearchForm extends React.PureComponent {

    getFields() {
        const { entityFields } = this.props;

        const { getFieldDecorator } = this.props.form;
        const children = entityFields.map((itm, i) => {
            const { fieldName, type, displayName, rules, onCustomRender, initialValue } = itm;

            const placeHolder = itm.placeHolder || fieldName;
            const layoutItem = {
                ...formItemDefaultLayout, 
                wrapperCol: {
                    span: itm.layoutColSpan || 8
                }
            }
            let displayComp = null;
            let extraConfig = {}
            if (onCustomRender) displayComp = onCustomRender(itm);
            else {
                switch (type) {
                    case 'text':
                        displayComp = (<Input placeholder={`${placeHolder}...`} />);
                        break;
                    case 'select':
                        displayComp = DataEntitySelectFields(placeHolder, itm.selectValues);
                        break;
                    case 'checkbox':
                        extraConfig.valuePropName = "checked"; // checkbox using checked insted of value fields!
                        displayComp = (<Checkbox />)
                        break;
                    default:
                        throw new Error("DataEntitiesSearchForm. Unknown type " + type);
                        break;
                }
            }
            return (
                <FormItem key={i} label={`${displayName}`} {...layoutItem} >
                    {getFieldDecorator(`${fieldName}`, {
                        rules: rules || [],
                        initialValue: initialValue,
                        ...extraConfig
                    })(
                        displayComp
                    )}
                </FormItem>
            )
        });

        return children;
    }

    _handleSearch = (e) => {
        const { onSearchHandler } = this.props;

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                onSearchHandler && onSearchHandler(values)
            }
        });
    }

    __handleReset = (e) => {
        this.props.form.resetFields();
    }

    render() {
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this._handleSearch}
                layout="horizontal"
            >
                <Row gutter={24}>{this.getFields()}</Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">Search</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this._handleReset}>
                            Clear
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(DataEntitiesSearchForm);;