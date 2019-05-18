import React from "react";
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from "react-navigation";
import Icon from 'react-native-vector-icons/MaterialIcons'

import Login from './containers/Login'
import Register from './containers/Register'
import Chat from './containers/Chat'

const RootStack = createStackNavigator({
  Login: {
    screen: Login
  },
  Register: {
    screen: Register
  },
  Chat: {
    screen: Chat
  }
}, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    },
    initialRouteName: 'Chat',
  }
)

export default createAppContainer(RootStack)