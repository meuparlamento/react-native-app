import { SET_OFFLINE, SET_READY, SET_FIRST_USE } from './actionTypes';

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