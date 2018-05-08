import React, {Fragment} from 'react';
import { Form, Input, Button, Row, Col, Select, message, Divider, Icon } from "antd";
import { inject } from 'mobx-react';
import MetaMaskRequire from '../../components/MetaMaskRequire/MetaMaskRequire';
import DynamicForm from '../../components/DynamicForm';

import './index.scss';

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

@inject("ApplicationStore", "Auth")
class AccountSettingPage extends React.Component {
    state = {
        data: {}
    }

    componentDidMount() {
        this._fetchData();
    }

    _showError(msg) {
        message.error(msg)
    }

    _onSubmitHandle = async (data) => {
        const { ApplicationStore, Auth } = this.props;
        const res = await ApplicationStore.updateSetting(data);
        if(!res) {
            return message.error('Update data error');
        } else {
            const data = [
                ...this.state.data.filter(setting => setting.label !== res.body.label) ,
                res.body];
            this.setState({ data }, 
                () => message.success('Your setting has been updated !'))
        }
    }

    async _fetchData() {
        const { ApplicationStore } = this.props;
        const res = await ApplicationStore.querySetting();

        if (res === null || res.body.length === 0) {
            return this._showError('Data not found!');
        }
        const data = res.body;
        this.setState({ data })
    }

    render() {
        const { data } = this.state;
        return (<Fragment>
            {
                data.length >0 && data.map((item, index) => 
                    <DynamicForm
                        data={item}
                        key={index}
                        onSubmitHandle={this._onSubmitHandle}
                    />)
            }
        </Fragment>)
    }
}

export default AccountSettingPage;