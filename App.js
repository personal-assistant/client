import React from 'react';
import { Font } from 'expo';
import { Provider } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Navigation from './Navigation'
import { Container } from 'native-base'
import store from './store'
import { YellowBox } from 'react-native';

export default class App extends React.Component {
  state = {
    fontLoaded: false,
  }

  componentWillMount() {
    YellowBox.ignoreWarnings(['Setting a timer for a long'])
  }
  

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
      <Provider store={store}>
        {
          this.state.fontLoaded ? (
            <Navigation />
          ) : null
        }
      </Provider>
    )
  }
}