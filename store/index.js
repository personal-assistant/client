import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers/rootReducer'

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
  )
)

export default store