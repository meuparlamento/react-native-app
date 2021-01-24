import store from '../store';
import { getCardsContent } from '../helpers/api.helper';

import { SET_OFFLINE, SET_READY, SET_FIRST_USE, FETCH_CARDS, GET_CARDS_SUCCESS, GET_CARDS_ERROR, ADD_CARD, FETCH_SINGLE_CARD, CLEAN_CARDS, SET_RECENT_PROPOSAL_DATA, CLEAR_RECENT_PROPOSAL_DATA } from './actionTypes';

export const setOffline = value => {
    return {
        type: SET_OFFLINE,
        payload: value,
    }
} 

export const setAppReady = value => {
    return {
        type: SET_READY,
        payload: value,
    }
}

export const setAppFirstUse = value => {
    return {
        type: SET_FIRST_USE,
        payload: value,
    }
}

export const fetchCards = quantity => {
    console.log('in actions', quantity);
    return {
        type: FETCH_CARDS,
        payload: { quantity },
    }
}

export const fetchSingleCard = () => ({ type: FETCH_SINGLE_CARD });

export const getCardsSuccess = cards => {
    return {
        type: GET_CARDS_SUCCESS,
        data: cards,
    }
}

export const addCardSuccess = card => {
    return {
        type: ADD_CARD,
        data: card,
    }
}

export const getCardsError = () => {
    return {
        type: GET_CARDS_ERROR,
    }
}

export const cleanCards = () => {
    return {
        type: CLEAN_CARDS,
    }
}

export const setRecentProposalData = (data) => {
    return {
        type: SET_RECENT_PROPOSAL_DATA,
        data: data,
    }
}

export const clearRecentProposalData = () => {
    return {
        type: CLEAR_RECENT_PROPOSAL_DATA,
    }
}

export const thunkGetCards = (quantity, recentProposals = false) => {
    store.dispatch(fetchCards())
    return async (dispatch) => {
        try {
            dispatch(getCardsSuccess( await getCardsContent(quantity, recentProposals)));
        } catch (error) {
            console.log('ERROR IN ACTIONS', error);
            dispatch(getCardsError());
        }
    }
}

export const thunkReplaceCard = (recentProposals = false) => {
    store.dispatch(fetchSingleCard())
    return async (dispatch) => {
        try {
            const [ card ] = await getCardsContent(1, recentProposals);
            console.log('IN ACTION CARD', card);
            dispatch(addCardSuccess(card));
        } catch (error) {
            console.log('ERROR IN ACTIONS', error);
            dispatch(getCardsError());
        }
    }
}