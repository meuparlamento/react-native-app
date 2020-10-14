import Reducers from '../reducers';
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from 'redux';

const store = createStore(Reducers, applyMiddleware(thunk));

export default store