import React, { Component } from 'react';
import AppLayout from './containers/Layout/AppLayout'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PageConfigs } from './pages/_pageConfig';
import { Provider, observer } from 'mobx-react';
import stores from './stores';

import FullScreenLoading from './components/Loading/FullScreenLoading';
import LoginPage from './pages/Login/LoginPage';
import FirstSetupPage from "./pages/FirstSetup/FirstSetupPage";
import QuickTest from './pages/QuickTest/QuickTest';


class App extends Component {

  @observer
  render() {
    const { Auth, ApplicationStore } = stores;
    const loggedIn = Auth.loggedIn();
    const isDev = ApplicationStore.isDev;
    return (
      <BrowserRouter basename="dashboard" >
        <Provider {...stores}>
          <div>
            <Route path="*" render={() => (
              loggedIn ? (
                <AppLayout pageConfigs={PageConfigs} />
              ) : (
                  <Switch>
                    <Route path="/setup" component={FirstSetupPage} />
                    {isDev && <Route path="/quicktest" component={QuickTest} />}
                    <Route component={LoginPage} />
                  </Switch>
                )
            )} />
            {ApplicationStore.isLoading && <FullScreenLoading />}
          </div>

        </Provider>
      </BrowserRouter >
    );
  }
}

export default App;
