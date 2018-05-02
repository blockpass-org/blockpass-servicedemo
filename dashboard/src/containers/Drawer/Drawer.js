import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { DrawerConfigs } from '../../pages/_pageConfig';
import { inject, observer } from 'mobx-react';

const MenuItem = ({ key, icon, path, text }) => (
    <Menu.Item key={key}>
        <Link to={path}>
            <Icon type={icon} />
            <span>{text}</span>
        </Link>
    </Menu.Item>
)

@inject('Auth')
export default class Drawer extends Component {

    @observer
    render() {
        const { Auth, collapsed } = this.props;

        return <Menu theme="dark">
            {DrawerConfigs.filter(itm => Auth.hasPermission(itm.scope)).map((itm, i) => MenuItem({ key: i, collapsed, ...itm }))}
        </Menu>
    }
}