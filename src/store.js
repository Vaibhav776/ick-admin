import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers/'

import thunk from 'redux-thunk'

const initialState = {};

const middleware = [thunk];
// const extenstion = process.env.NODE_ENV === 'development' ? (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()):(null)

export default createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        // extenstion
    )
)
