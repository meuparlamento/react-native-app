 
import { SET_OFFLINE, SET_READY, SET_FIRST_USE } from '../actions/actionTypes';
const initialState = {
    firstUse: false,
    isAppReady: false,
    isOffline: false,
  }
  
export default appStatusReducer = (state = initialState, action) => {
  console.log('NETWORK REDUCER ACTION =>', action);
    switch(action.type) {
        case SET_OFFLINE:
            return {
              ...state,
              isOffline: action.payload,
            };
        case SET_READY:
          return {
            ...state,
            isAppReady: action.payload,
          };
        case SET_FIRST_USE:
          return {
            ...state,
            firstUse: action.payload,
          };
        default: 
        return state;
    }
  }