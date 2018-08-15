import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import './App.css';
import MapContainer from './MapContainer'
import Drawer from './Drawer'

class App extends Component {
  render() {
    return (
      <div>
        {/*<a className="menu" tabIndex="0">
          <svg className="hamburger-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"/>
          </svg>
        </a>
        <h1 className="heading"> Top 10 European Amusement Parks </h1>*/}
        <Drawer google={this.props.google}/>
        {/*<MapContainer google={this.props.google} />*/}
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDca8NGMI8yzLbpHvscjtYHnmOZs4bzcEE'
})(App)