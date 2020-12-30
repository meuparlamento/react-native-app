import Reducers from '../reducers';
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Root reducer with persist config
const reducers = persistReducer(
    {
        key: 'root',
        storage: AsyncStorage,
        whitelist: ['proposalReducer']
    },
    Reducers,
);

const store = createStore(reducers, applyMiddleware(thunk));
export const persistor = persistStore(store);

export default store