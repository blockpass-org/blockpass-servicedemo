import React, {Component} from 'react';
import {Layout} from 'antd';
import {Switch, Route} from 'react-router-dom';
import {withRouter} from 'react-router';
import './style.css';
import {inject, observer} from 'mobx-react';

const {Content} = Layout;

@inject('Auth')
class Main extends Component {
		@observer
		render() {
				const {Auth, pageConfigs} = this.props;
				return (
						<div>
								<Content>
										<Switch>
												{pageConfigs.filter((itm) => Auth.hasPermission(itm.scope)).map((itm, i) => (
														<Route
																exact
																key={i}
																path={itm.path}
																render={(routeProps) => (<itm.component {...routeProps} collapsed={this.props.collapsed}/>)}/>
												))}
										</Switch>
								</Content>
						</div>
				);
		}
}

export default withRouter(Main);
