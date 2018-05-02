import React, { Component } from 'react';
import { Layout, Icon } from 'antd';
import Drawer from "../Drawer/Drawer";
import Main from "..//Main/Main";
import LoginUserIcon from "../../components/Header/LoginUserIcon";

import './style.css';
import { inject } from 'mobx-react';

const { Header, Sider, Footer } = Layout;

@inject("ApplicationStore", "Auth")
export default class AppLayout extends Component {
    
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        const {ApplicationStore, Auth, pageConfigs} = this.props;

        return <Layout style={{height:"100vh"}}>
            <Sider
                trigger={null}
                collapsible
                collapsed={this.state.collapsed}
            >
                <div className="logo" />
                <Drawer collapsed={this.state.collapsed} />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <Icon
                        className="trigger"
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    <LoginUserIcon/>
                    <Icon
                        type="mail"
                        className="mail"
                    />

                </Header>
                <Main pageConfigs={pageConfigs}/>
                <Footer style={{ textAlign: 'center' }}>
                    Demo 3rd Services ©2018 Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    }
}