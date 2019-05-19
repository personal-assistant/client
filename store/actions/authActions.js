import Axios from 'axios'
import { Platform } from 'react-native';
const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000'

export const register = newUser => {
  return (dispatch, getState) => {
    Axios.post(baseUrl + '/users/register', newUser)
    .then(({ data }) => {
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: data
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
  return (dispatch, getState) => {
    Axios.post(baseUrl + '/users/login', user)
    .then(({ data }) => {
      console.log(data, "<== data")
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: data
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