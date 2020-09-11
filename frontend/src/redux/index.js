import { createStore, combineReducers, compose } from 'redux';
import Reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reducers = combineReducers(
{
    Reducers 
})
 
const store = createStore(
    reducers,
    composeEnhancers()
);
    
export default store;