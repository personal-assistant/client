import React from "react"
import { createBottomTabNavigator, createStackNavigator, createAppContainer, createNavigationContainer, createSwitchNavigator } from "react-navigation"
import Icon from 'react-native-vector-icons/MaterialIcons'
import Splash from './containers/Splash'
import Login from './containers/Login'
import Register from './containers/Register'
import Chat from './containers/Chat'
import MovieDetail from './containers/MovieDetail'

const AppNavigation = createStackNavigator({
  Chat :{
    screen : Chat,
    navigationOptions : {
      title : 'Eve'
    }
  },
  MovieDetail: {
    screen: MovieDetail
  }
}, {
  headerMode : 'none',
  navigationOptions : {
    headerVisible : false,

  },
  initialRouteName: 'Chat'
})

// const ChatStack = createStackNavigator({
//   Chat: {
//     screen: Chat,
//     navigationOptions: {
//       title: 'Eve'
//     }
//   },
//   MovieDetail: {
//     screen: MovieDetail
//   }
// }, {
//     headerMode: 'none',
//     navigationOptions: {
//       headerVisible: false,
//     },
//     initialRouteName: 'Chat',
//   })
const AuthNavigation = createSwitchNavigator({
  Login : Login,
  Register : Register
}, {
  headerMode: 'none',
  navigationOptions : {
    headerVisible : false,
  },
  initialRouteName : 'Login'
})

// const LoginStack = createStackNavigator({
//   Login: {
//     screen: Login
//   },
// }, {
//     headerMode: 'none',
//     navigationOptions: {
//       headerVisible: false,
//     },
//     initialRouteName: 'Login',
//   }
// )

// const RegisterStack = createStackNavigator({
//   Register: {
//     screen: Register
//   },
// }, {
//     headerMode: 'none',
//     navigationOptions: {
//       headerVisible: false,
//     },
//     initialRouteName: 'Register',
//   }
// )
const RootNavigation = createSwitchNavigator({
  Splash : Splash,
  App : AppNavigation,
  Auth : AuthNavigation
})


// const RootStack = createStackNavigator({
//   Login: {
//     screen: LoginStack
//   },
//   Register: {
//     screen: RegisterStack
//   },
//   Chat: {
//     screen: ChatStack
//   }
// }, {
//     headerMode: 'none',
//     navigationOptions: {
//       headerVisible: false,
//     },
//     initialRouteName: 'Login',
//   })



export default createAppContainer(RootNavigation)