import React from 'react';
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import Navigation from './Navigation'
import { Container } from 'native-base'

export default class App extends React.Component {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      <Container>
        {
          this.state.fontLoaded ? (
            <Navigation />
          ) : null
        }
      </Container>
    );
  }
}
