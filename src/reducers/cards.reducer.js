 
import { FETCH_CARDS, GET_CARDS_SUCCESS, GET_CARDS_ERROR, ADD_CARD, FETCH_SINGLE_CARD, CLEAN_CARDS } from '../actions/actionTypes';
const initialState = {
    cards: [],
    isLoadingCards: true,
    isLoadingSingleCard: false,
    isError: false
  }
  
export default cardsReducer = (state = initialState, action) => {
  console.log('cardsReducer ACTION =>', action.type, state);
    switch(action.type) {
        case FETCH_CARDS:
          return {
            ...state,
            isLoadingCards: true,
            isError: false,
            cards: [],
          };
          case FETCH_SINGLE_CARD: 
            return {
              ...state,
              isLoadingSingleCard: true,
            }
        case GET_CARDS_SUCCESS:
          return {
            ...state,
            cards: action.data,
            isLoadingCards: false,
            isError: false,
          }
        case ADD_CARD:
          return {
            ...state,
            cards: state.cards.map(card => {
              if (card.isActive) {
                return action.data;
              }
              return card;
            }),
          }
        case CLEAN_CARDS:
          return {
            ...state,
            cards: [],
          }
        case GET_CARDS_ERROR: 
          return {
            ...state,
            isError: true,
            isLoadingCards: false,
          }
        default: 
        return state;
    }
  }