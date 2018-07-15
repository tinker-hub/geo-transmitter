import React, { Component } from 'react';
import { Picker, StyleSheet, Text, View } from 'react-native';
import { Constants, Permissions } from 'expo';
import SocketIOClient from 'socket.io-client';
export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
    trainId: 0,
    trains: []
  };

  constructor(props) {
    super(props);

    this.URL = 'http://178.128.63.0:8081';

    this.socket = SocketIOClient(this.URL);
  }

  componentWillMount() {
    this._requestLocationPermission();
  }

  componentDidMount() {
    this._updateLocation();
    this.getTrains();
  }

  getTrains = async () => {
    const response = await fetch(`${this.URL}/api/trains`);
    const trains = await response.json();

    this.setState({
      trains: trains,
      trainId: trains[0]._id
    });
  };

  _requestLocationPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
    }
  };

  _updateLocation = () => {
    navigator.geolocation.watchPosition(
      ({ coords: { longitude, latitude, speed } }) => {
        const { trainId } = this.state;

        const location = {
          _id: trainId,
          location: { coordinates: [longitude, latitude] },
          speed: 7.5
        };

        this.setState(location);

        this.socket.emit('train', location);
      },
      ({ message }) => {
        this.setState({
          errorMessage: message
        });
      },
      {
        enableHighAccuracy: true
      }
    );
  };

  renderDropdown() {
    const { trains, trainId } = this.state;

    return (
      <Picker
        selectedValue={trainId}
        style={{ height: 50, width: 100 }}
        onValueChange={trainId => this.setState({ trainId })}
      >
        {trains.map(({ _id, name }) => (
          <Picker.Item key={_id} label={name} value={_id} />
        ))}
      </Picker>
    );
  }

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    return (
      <View style={styles.container}>
        {this.renderDropdown()}
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center'
  }
});
