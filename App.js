import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Constants, Permissions } from 'expo';
import SocketIOClient from 'socket.io-client';
export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
  };

  constructor(props) {
    super(props);

    const URL = 'http://e87d4a7f.ngrok.io/'

    this.socket = SocketIOClient(URL);
  }

  componentWillMount() {
    this._requestLocationPermission();
  }

  componentDidMount() {
    this._updateLocation();
  }

  _requestLocationPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
  }

  _updateLocation = () => {
    navigator.geolocation.watchPosition(
      location => {
        this.setState({
          location,
        });

        this.socket.emit('getTrainLocation', location);
      },
      ({ message }) => {
        this.setState({
          errorMessage: message,
        });
      },
      {
        enableHighAccuracy: true,
      }
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
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});
