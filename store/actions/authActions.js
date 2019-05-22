import Axios from 'axios'
import { Platform, AsyncStorage } from 'react-native';
// const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000'
const baseUrl = 'http://35.247.157.227'

export const register = newUser => {
  let userData
  return (dispatch, getState) => {
    Axios.post(baseUrl + '/users/register', newUser)
    .then(({ data }) => {
      userData = data
      return AsyncStorage.setItem('token', data.token)
    })
    .then(()=>{
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: userData
      })
    })
    .catch(err => {
      dispatch({
        type: 'REGISTER_ERROR',
        payload: err.message
      })
    })
  }
}

export const login = user => {
  let userData
  return (dispatch, getState) => {
    Axios.post(baseUrl + '/users/login', user)
    .then(({ data }) => {
      userData = data
      return AsyncStorage.setItem('token', data.token)
    })
    .then(()=>{
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: userData
      })
    })
    .catch(err => {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: err.message
      })
    })
  }
}

<<<<<<< HEAD
export const setUser = loginData => {
  return {
    type : "SPLASH_LOGIN",
    payload : loginData
  }
}

export const logout = () =>{
  return {
    type : "SIGNOUT_SUCCESS",
=======
export const dismissAuthError = () => {
  return (dispatch, getState) => {
    dispatch({
      type: 'DISMISS_AUTH_ERROR'
    })
>>>>>>> dev
  }
}