import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import './App.css';

import AppDrawer from './Drawer'

class App extends Component {
  render() {
    return (
      <div>
        <AppDrawer google={this.props.google}/>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDca8NGMI8yzLbpHvscjtYHnmOZs4bzcEE'
})(App)