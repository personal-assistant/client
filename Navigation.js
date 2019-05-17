import React from "react";
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from "react-navigation";
import Icon from 'react-native-vector-icons/MaterialIcons'

import Login from './containers/Login'
import Register from './containers/Register'

const RootStack = createStackNavigator({
  Login: {
    screen: Login
  },
  Register: {
    screen: Register
  },
}, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    },
    initialRouteName: 'Login',
  }
)

export default createAppContainer(RootStack)