import React from "react";
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from "react-navigation";
import Login from './containers/Login'
import Icon from 'react-native-vector-icons/MaterialIcons'

const RootStack = createStackNavigator({
  Login: {
    screen: Login
  }
}, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    },
    initialRouteName: 'Login',
  }
)

export default createAppContainer(RootStack);
