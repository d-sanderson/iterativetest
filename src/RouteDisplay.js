
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
const mapStyles = {
  map: {
    border: '1px solid black',
    width: '500px',
    height: '300px',
    zIndex: '-1'
  },
};

export class RouteDisplay extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (this.props.submitted !== prevProps.submitted) {
      this.loadRoute();
    }
  }

  loadRoute() {
    if (this.props && this.props.google) {
      const { google } = this.props;
      const maps = google.maps;

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();

      directionsService.route(
        {
          origin: { query: this.props.origin },
          destination: { query: this.props.destination },
          travelMode: this.props.travelMode,
        },
        (response, status) => {
          status === 'OK'
            ? directionsRenderer.setDirections(response)
            : window.alert('Directions request failed due to ' + status);
        }
      );

      let { zoom } = this.props;
      let { lat, lng } = this.props.initialCenter;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom,
        }
      );

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      this.map = new maps.Map(node, mapConfig);
      directionsRenderer.setMap(this.map);
    }
  }

  render() {
    const style = Object.assign({}, mapStyles.map);
    return (
      <div>
        <h1>Trip Calculator</h1>
        <div style={style} ref="map">
          Enter an Origin and Destination.
        </div>
        <h1>
          {this.props.distance}
        </h1>
        <h1>
          {this.props.duration}
        </h1>
      </div>
    );
  }
}
export default RouteDisplay;

RouteDisplay.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: 35.0844,
    lng: -106.6504,
  },
  visible: true,
};

