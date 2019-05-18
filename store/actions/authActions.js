import Axios from 'axios'

export const signUp = newUser => {
  return async (dispatch, getState) => {
    Axios.post('http://localhost:3000/users/register', {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password
    })
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

export const signIn = user => {
  return (dispatch, getState) => {
    Axios.post('http://localhost:3000/users/login', {
      email: user.email,
      password: user.password
    })
    .then(({ data }) => {
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