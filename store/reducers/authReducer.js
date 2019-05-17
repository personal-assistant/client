const initState = {
  authError: null,
  loggedInUser: null
}

const authReducer = (state = initState, action) => {
  switch(action.type) {
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        authError: null,
        loggedInUser: action.payload
      }

    case 'REGISTER_ERROR': {
      return {
        ...state,
        authError: action.payload
      }
    }

    case 'LOGIN_ERROR':
      return {
        ...state,
        authError: 'Login failed'
      }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        authError: null,
        loggedInUser:action.payload
      }

    case 'SIGNOUT_SUCCESS':
      return {
        ...state,
        authError: null,
        loggedInUser: action.payload
      }

    case 'SIGNOUT_ERROR':
      return {
        ...state,
        authError: action.payload
      }

    default:
      return state
  }
}

export default authReducer