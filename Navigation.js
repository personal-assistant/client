import React from "react"
import { createBottomTabNavigator, createStackNavigator, createAppContainer, createNavigationContainer } from "react-navigation"
import Icon from 'react-native-vector-icons/MaterialIcons'

import Login from './containers/Login'
import Register from './containers/Register'
import Chat from './containers/Chat'
import MovieDetail from './containers/MovieDetail'

const ChatStack = createStackNavigator({
  Chat: {
    screen: Chat,
    navigationOptions: {
      title: 'Eve'
    }
  },
  MovieDetail: {
    screen: MovieDetail
  }
}, {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    initialRouteName: 'Chat',
  })

const LoginStack = createStackNavigator({
  Login: {
    screen: Login
  },
}, {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    initialRouteName: 'Login',
  }
)

const RegisterStack = createStackNavigator({
  Register: {
    screen: Register
  },
}, {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    initialRouteName: 'Register',
  }
)

const RootStack = createStackNavigator({
  Login: {
    screen: LoginStack
  },
  Register: {
    screen: RegisterStack
  },
  Chat: {
    screen: ChatStack
  }
}, {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    initialRouteName: 'Login',
  })



export default createAppContainer(RootStack)