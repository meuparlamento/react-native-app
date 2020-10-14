import appStatusReducer from './appStatus.reducer';
import cardsReducer from './cards.reducer';
import proposalReducer from './proposal.reducer'
import { combineReducers } from 'redux';

export default Reducer = combineReducers({
    appStatusReducer,
    cardsReducer,
    proposalReducer,
})