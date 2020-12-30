// --------------- LIBRARIES ---------------
import { SET_RECENT_PROPOSAL_DATA, CLEAR_RECENT_PROPOSAL_DATA } from '../actions/actionTypes';

// --------------- LIBRARIES ---------------
const initialState = {
    recentProposalData: [],
}

// --------------- REDUCER FUNCTION ---------------
export default ProposalReducer = (state = initialState, action) => {
    console.log('proposalReducer ACTION =>', action.type, action.data);
    switch(action.type) {
        case SET_RECENT_PROPOSAL_DATA:
            return {...state, recentProposalData: [...state.recentProposalData, action.data]};
        case CLEAR_RECENT_PROPOSAL_DATA:
            return initialState;

        default:
            return state;
    }
}