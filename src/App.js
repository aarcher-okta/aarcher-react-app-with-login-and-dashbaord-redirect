import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security, SecureRoute } from '@okta/okta-react';
import Home from './Home';
import Profile from './Profile';

const oktaAuth = new OktaAuth({
  issuer: 'https://login.archfaktorciam.xyz/oauth2/default',
  clientId: '0oa1e9uyd1iXw4AAM697',
  redirectUri: window.location.origin + '/login/callback'
});

class App extends Component {

  constructor(props) {
    super(props);
    this.restoreOriginalUri = async (_oktaAuth, originalUri) => {
      // set route route to "dashbaord" after authentication and callback to login URI - /dashboard is just a route that holds an external href link to the URL for the okta dashboard
      props.history.replace('/dashboard');
      //original restorUI code...
      // props.history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
    };
  }

  render() {
    return (
      <Security oktaAuth={oktaAuth} restoreOriginalUri={this.restoreOriginalUri}>
        <Route path="/" exact={true} component={Home}/>
        <Route path="/login/callback" component={LoginCallback}/>
        <SecureRoute path="/profile" component={Profile}/>
        {/* set the external path in the dashboard route which is added to the history in the restorOriginalUri function above*/}
        <SecureRoute path="/dashboard" component={() => {
          window.location.href = 'https://login.archfaktorciam.xyz';
          return null;
        }}/>
      </Security>
    );
  }
}

const AppWithRouterAccess = withRouter(App);

class RouterApp extends Component {
  render() {
    return (<Router><AppWithRouterAccess/></Router>);
  }
}

export default RouterApp;
