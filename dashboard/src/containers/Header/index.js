import React, {PureComponent} from 'react';
import {
  Layout,
  Row,
  Col,
  Icon,
  Menu,
  Dropdown
} from 'antd';
import {Link} from 'react-router-dom';
import {inject} from 'mobx-react';
import {withRouter} from 'react-router';
import './header.scss';
import {Logo, User, BurgerIconMenu} from '../../components/StoryBookComponents';
import {path} from 'lodash/fp';
const {Header} = Layout;

const titleHeader = [
  {
    path: '/new/kyc-detail',
    title: 'KYC'
  }, {
    path: '/new/kyc-list',
    title: 'KYC List'
  }, {
    path: '/permissions',
    title: ''
  }, {
    path: '/setting',
    title: 'Settings'
  }, {
    path: '/quicktest',
    title: 'Quicktest'
  }, {
    path: '/rootsetting',
    title: 'Rootsettings'
  }, {
    path: '/review-certificate',
    title: 'Certificate Review'
  }
];

@inject('ApplicationStore', 'Auth')
class HeaderLayout extends PureComponent {
  state = {
    username: ''
  }

  componentDidMount() {
    this.getProfileSetting();
  }

  async getProfileSetting() {
    const {ApplicationStore} = this.props;
    const res = await ApplicationStore.getProfileSetting();
    this.setState({
      username: path(['body', 'userName'])(res)
    })
  }
  getTitle = (pathname) => {
    if (pathname === '/') 
      return '';
    const result = titleHeader.find((item) => pathname.indexOf(item.path) !== -1);
    return result
      ? result.title
      : '';
  };

  toggleOpenSideBar = () => this
    .props
    .toggleOpenSidebar();

  render() {
    const {history, location: {
        pathname
      }, ApplicationStore, Auth} = this.props;
    const title = this.getTitle(pathname);
    const dropdownMenu = (
      <Menu >
        <Menu.Item key="0">
          <Link to="/setting">
            Setting
          </Link>
        </Menu.Item>
        < Menu.Divider/>
        <Menu.Item key="1">
          <Link to="/rootsetting">
            Root settings
          </Link>
        </Menu.Item>
        < Menu.Divider/>
        <Menu.Item key="3">
          <Link to="/permissions">
            Permission Control
          </Link>
        </Menu.Item>
        < Menu.Divider/>
        <Menu.Item
          key="4"
          onClick={(_) => {
          if (ApplicationStore.logout()) 
            Auth.clearState();
          }}>
          <Icon type="logout"/>
          Logout
        </Menu.Item>
      </Menu>
    )
    return (
      <Header className="header__wrapper">
        <Row>
          <Col span={4}>
            <Link to="/">
              < Logo type="left"/>
            </Link>
          </Col>
          <Col span={18} className="header__body">
            <div className="header__body-wrapper">
              {pathname !== '/' && (<Icon
                type="arrow-left"
                className="back-button"
                onClick={() => history.goBack()}/>)}
              <h4 className="header__title">
                {title}
              </h4>
              <div className="header__right">
                <div className="header__user-info">
                  <User userName={this.state.username}/>
                </div>
                <div className="header__user-info">
                  <BurgerIconMenu toggleOpenSidebar={this.toggleOpenSideBar}/>
                </div>
                <Dropdown overlay={dropdownMenu} trigger={['click']}>
                  <Icon type="setting" className="header__setting"/>
                </Dropdown>
              </div>
            </div>
          </Col>
        </Row>
      </Header>
    )
  }
}

export default withRouter(HeaderLayout);