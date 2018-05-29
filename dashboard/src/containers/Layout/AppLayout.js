import React, { Component } from 'react';
import { Layout } from 'antd';
import { withRouter } from 'react-router';
import Main from '../Main/Main';
import './style.scss';
import { inject } from 'mobx-react';
import HeaderLayout from '../Header';

const { Footer } = Layout;

@inject('ApplicationStore', 'Auth')
class AppLayout extends Component {
	state = {
		collapsed: false
	};

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed
		});
	};

	render() {
		const {pageConfigs } = this.props;

		return (
			<Layout>
				<HeaderLayout toggleOpenSidebar={this.toggle} />
				<Layout>
					<Main
						pageConfigs={pageConfigs}
						collapsed={this.state.collapsed}
					/>
				</Layout>
				<Footer
					style={{
						textAlign: 'center'
					}}
				>
					Blockpass Demo Services ©2018 Powered by Ant UED
				</Footer>
			</Layout>
		);
	}
}

export default withRouter(AppLayout);
