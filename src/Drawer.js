import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import InputBase from '@material-ui/core/InputBase';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'absolute',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: -drawerWidth,
    marginBottom: '50px'
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
});

class AppDrawer extends React.Component {
  state = {
    open: false,
    
    locations: [
      {name: "DisneyLand France", location: {lat: 48.872236, lng: 2.775808}},
      {name: "PortAventura Spain", location: {lat: 41.087832, lng: 1.157246}},
      {name: "Futuroscope France", location: {lat: 46.669860, lng: 0.369756}},
      {name: "EuropaPark Germany", location: {lat: 48.266048, lng:  7.721986}},
      {name: "AsterixPark France", location: {lat: 49.134226, lng: 2.571198}},
      {name: "Grona Lund Sweden", location: {lat: 59.323384, lng:  18.096369}},
      {name: "Gardaland Italy", location: {lat: 45.455035, lng:  10.713736}},
      {name: "Tivoli Gardens Denmark", location: {lat: 55.673686, lng:  12.568145}},
      {name: "Walibi Belgium", location: {lat: 50.701873, lng:  4.594033}},
      {name: "Efteling Netherlands", location: {lat: 51.650653, lng:  5.049745}},

    ],
    query: '',
    markers: [],
    infowindow: new this.props.google.maps.InfoWindow(),
    highlightedIcon: null,
    data:[]
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    this.loadMap()
    this.onclickLocation()
    // Create a deffirent color for the clicked marker
    this.setState({highlightedIcon: this.makeMarkerIcon('FFFF24')})
    this.getDataWiki()
  }

  loadMap() {
    if (this.props && this.props.google) {
      const {google} = this.props
      const maps = google.maps

      const mapRef = this.refs.map
      const node = ReactDOM.findDOMNode(mapRef)

      const mapConfig = Object.assign({}, {
        center: {lat: 52.500979, lng: 13.457640},
        zoom: 12,
        mapTypeId: 'roadmap'
      })
      
      this.map = new maps.Map(node, mapConfig)
      this.addMarkers()
    }

  }

  onclickLocation = () => {
    const that = this
    const {infowindow} = this.state

    const displayInfowindow = (e) => {
      const {markers} = this.state
      const markerInd =
        markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
      that.populateInfoWindow(markers[markerInd], infowindow)
    }
    document.querySelector('.location-list').addEventListener('click', function (e) {
      if (e.target && e.target.nodeName === "LI") {
        displayInfowindow(e)
      }
    })
    document.querySelector('.location-list').addEventListener('keypress', function (e) {
      if (e.target && e.target.nodeName === "LI") {
        displayInfowindow(e)
      }
    })
  }

  handleValueChange = (e) => {
    this.setState({query: e.target.value})
  }

  addMarkers = () => {
    const {google} = this.props
    let {infowindow} = this.state
    const bounds = new google.maps.LatLngBounds()

    this.state.locations.forEach((location, ind) => {
      const marker = new google.maps.Marker({
        position: {lat: location.location.lat, lng: location.location.lng},
        map: this.map,
        title: location.name
      })

      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow)
      })
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
      bounds.extend(marker.position)
    })
    this.map.fitBounds(bounds)
  }
//handling the Wiki-Media API requestto get information
  getDataWiki = () => {
    let newData = [];
    let failedData = [];
    this.state.locations.map((location) => {
      return fetch(`https://en.wikipedia.org/w/api.php?&action=query&list=search&prop=extracts&titles&format=json&origin=*&srlimit=1&srsearch=${location.name}`, {
          headers: {
            'Origin': 'http://localhost:3000/',
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
      .then(response => response.json())
      .then(data => {
        let url = encodeURI(`https://en.wikipedia.org/wiki/${data.query.search['0'].title}`);
        let element = {
          text: `${data.query.search['0'].snippet} 
                    "Wikipedia"`,
          id: location.id,
          url: url,
          readMore: 'Read more WIKI'
        };
        newData.push(element);
        this.setState({data: newData});
        
      })
      .catch(() => {
        console.log('An error occured')
        let element = {
          id: location.id,
          text: "<span>Sorry, it wasn't possible to get any data from Wikipedia, please, try later</span>",
          readMore: "☹"
        };
        failedData.push(element);
        this.setState({data: failedData});
        
      })
    })
  }

  populateInfoWindow = (marker, infowindow) => {
    const defaultIcon = marker.getIcon()
    const {highlightedIcon, markers, data} = this.state
    // Check the state of infowindow if already opened on this marker.
    if (infowindow.marker !== marker) {
      // reset the color of previous marker
      if (infowindow.marker) {
        const ind = markers.findIndex(m => m.title === infowindow.marker.title)
        markers[ind].setIcon(defaultIcon)
      }
      // change marker icon color of clicked marker
      marker.setIcon(highlightedIcon)
      infowindow.marker = marker
      //fetching data from wikipedia using third party API
      data.filter((item) => {
        if(item.id === marker.id) {
          infowindow.setContent(`<div class='marker'>
            <h3>${marker.title}</h3>
            <div>
              <p>${item.text}...</p>
              <a rel="noopener noreferrer" href=${item.url} target="_blank">${item.readMore}</a>
            </div>
          </div>`);
        }
      })
      
      infowindow.open(this.map, marker)
      // clearing the marker property when the infowindow is closed.
      infowindow.addListener('closeclick', function () {
        infowindow.marker = null
        marker.setIcon(defaultIcon)
      })
    }
  }

  makeMarkerIcon = (markerColor) => {
    const {google} = this.props
    let markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(25, 45),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 45),
      new google.maps.Size(25, 45));
    return markerImage;
  }

  //adding this function for the state of authentication failure
  gm_authFailure = () => {
    alert("Google Map authorization error. Please try refreshing the page.");
  } 


  render() {
    const { classes } = this.props;
    const { open } = this.state;

    const {locations, query, markers, infowindow} = this.state
    if (query) {
      locations.forEach((l, i) => {
        if (l.name.toLowerCase().includes(query.toLowerCase())) {
          markers[i].setVisible(true)
        } else {
          if (infowindow.marker === markers[i]) {
            // close the info window if marker removed
            infowindow.close()
          }
          markers[i].setVisible(false)
        }
      })
    } else {
      locations.forEach((l, i) => {
        if (markers.length && markers[i]) {
          markers[i].setVisible(true)
        }
      })
    }

    const drawer = (
      <Drawer
        variant="persistent"
        
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className="{classes.drawerHeader} filter-text">
          <span > Filter your search </span>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon /> 
          </IconButton>
        </div>
        <Divider />
        <List>
          <div className="text-input">
            <InputBase
              className={classes.input}
              placeholder="Search parks"
              inputProps={{ 'aria-label': 'search parks' }}
              value={this.state.value}
              onChange={this.handleValueChange}
            />
            {/*<input  role="searchbox" type='search'
                   value={this.state.value}
                   onChange={this.handleValueChange}/>*/}
            <ul role="list" className="location-list">{
              markers.filter(m => m.getVisible()).map((m, i) =>
                (<li key={i} role="listitem" tabIndex='0'>{m.title}</li>))
            }</ul>
          </div>
        </List>
      </Drawer>
    );

    let before = drawer;
    
    return (
      <div className={classes.root}>
        
        <div className={classes.appFrame}>
          <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-left`]]: open,
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" noWrap>
                Top 10 European Amusement Parks
              </Typography>
            </Toolbar>
          </AppBar>
          {before}
          <main
            className={classNames(classes.content, classes[`content-left`], {
              [classes.contentShift]: open,
              [classes[`contentShift-left`]]: open,
            })}
          >
            <div className={classes.drawerHeader} />
            <div role="application" className="map" ref="map">
            loading map...
          </div>
          </main>
         
        </div>
      </div>
    );
  }
}

AppDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AppDrawer);