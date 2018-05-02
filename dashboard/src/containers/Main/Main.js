import React, { Component } from 'react';
import { Layout } from 'antd';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router'
import './style.css'
import { inject, observer } from 'mobx-react';

const { Content } = Layout;

@inject('Auth')
class Main extends Component {

    @observer
    render() {
        const { Auth, pageConfigs } = this.props
        return <div>
            {/* <Breadcrumb style={{ margin: '16px 0 0 16px' }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb> */}
            <Content className="maincontent">
                <Switch>
                    {
                        pageConfigs.filter(itm => Auth.hasPermission(itm.scope))
                            .map((itm, i) => (
                            <Route exact key={i} path={itm.path} component={itm.component} />
                        ))
                    }
                </Switch>
            </Content>
        </div>
    }
    
}

export default withRouter(Main);