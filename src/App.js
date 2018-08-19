import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import './App.css';

import Drawer from './Drawer'

class App extends Component {
  render() {
    return (
      <div>
        <Drawer google={this.props.google}/>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDca8NGMI8yzLbpHvscjtYHnmOZs4bzcEE'
})(App)