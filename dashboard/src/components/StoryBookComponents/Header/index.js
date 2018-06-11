import React from 'react';
import { Layout, Row, Col, Icon } from 'antd';
import Logo from '../Logo';
import UserLogo from '../User';
import BurgerIcon from './BurgerIcon';

const { Header } = Layout;

const HeaderLayout = () => {
	return (
		<Header className="header__wrapper">
			<Row>
				<Col span={4}>
			  	<Logo type="left" />
				</Col>
				<Col span={16} className="header__body">
					<div className="header__body-wrapper">
						<h4 className="header__title">
							USER LIST
						</h4>
						<div className="header__right">
							<div className="header__user-info">
								<UserLogo userName="username" />
							</div>
							<div className="header__user-info">
								<BurgerIcon />
							</div>
						</div>
					</div>
				</Col>
				<Col span={4}>
					<Logo type="right" />
				</Col>
			</Row>
		</Header>
	);
};

export default HeaderLayout;
