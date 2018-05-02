import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import './style.css';

@inject("ApplicationStore", "Auth")
class LoginUserIcon extends React.Component {

    _renderMenu() {
        const { ApplicationStore, Auth } = this.props;
        return <Menu>
            <Menu.Item>
                <Link to="/setting">Account Setting</Link>
            </Menu.Item>
            <Menu.Item>
                <a onClick={_ => {
                    if (ApplicationStore.logout()) {
                        Auth.clearState();
                    }
                }}> 
                    <Icon type="logout" /> Logout
                </a>
            </Menu.Item>
        </Menu>
    }

    render() {
        return <Dropdown overlay={this._renderMenu()} >
           <Icon type="user" className="logout"/>
        </Dropdown>
    }
}

export default LoginUserIcon