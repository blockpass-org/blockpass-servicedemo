import React from 'react';
import moment from 'moment';
import { Form, Input, Button, Col, Row, DatePicker, Rate, Popover, Icon } from 'antd';

import './ReviewDisplay.scss';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

const DEFAULT_EXPIRED_DATE_MS = 30 * 24 * 60 * 60 * 1000;

class UserReviewDisplay extends React.PureComponent {

    _handleSubmit = (isAccept) => {
        const { handleSubmit } = this.props;

        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                values.expiredDate = values.expiredDate.valueOf();
                handleSubmit && handleSubmit({
                    isAccept,
                    ...values
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return <Form>
            <Row type="flex" justify="center" >
                <Col span={20}>
                    <FormItem
                        label="Comments"
                    >
                        {getFieldDecorator('comments', {
                            rules: [{
                                required: true, message: 'Please input your comments!',
                            }],
                        })(
                            <TextArea rows={4} />
                        )}
                    </FormItem>

                    <Row gutter={8}>
                        <Col xs={{span:24}} md={{span:12}} >
                            <FormItem
                                label={(
                                    <Popover content="help" title="Info(wip)" >
                                        Expired Date: <Icon type="question-circle-o" />
                                    </Popover>
                                )}
                            >
                                {getFieldDecorator('expiredDate', {
                                    initialValue: moment(new Date(Date.now() + DEFAULT_EXPIRED_DATE_MS))
                                })(
                                    <DatePicker />
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={{span:24}} md={{span:12}}>

                            <FormItem
                                label={(
                                    <Popover 
                                        content={(
                                            <div>
                                                <p>1 stars: User must re-submit data every time SSO</p>
                                                <p>2 stars: User must re-submit data every 7 days</p>
                                                <p>3 stars: User must re-submit data every 30 days</p>
                                                <p>4 stars: User must re-submit data every 60 days</p>
                                                <p>5 stars: User must re-submit data every 90 days</p>
                                            </div>
                                        )}
                                        title="Info(wip)" >
                                        Rating <Icon type="question-circle-o" />
                                    </Popover>
                                )}
                            >
                                {getFieldDecorator('rate', {
                                    initialValue: 2
                                })(
                                    <Rate />
                                )}
                            </FormItem>

                        </Col>
                    </Row>


                    <Row type="flex" justify="end">
                        <Col xs={{span:24}} sm={{span:8}} md={{span:6}} className="review-button__wrapper">
                            <Button
                                icon="exclamation"
                                onClick={_ => {
                                    this._handleSubmit(false);
                                }}
                                className="review-button__button"
                            >
                                Reject
                                </Button>
                        </Col>
                        <Col xs={{span:24}} sm={{span:8}} md={{span:6}} className="review-button__wrapper">
                            <Button
                                type="primary"
                                icon="check-circle-o"
                                onClick={_ => {
                                    this._handleSubmit(true);
                                }}
                                className="review-button__button"
                            >
                                Accept
                                </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Form>
    }
}

export default Form.create()(UserReviewDisplay);