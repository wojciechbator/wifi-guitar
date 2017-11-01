import { 
    AUTOCOMPLETE_VALUE
} from '../types/autoCompleteTypes';

const initialState = {
    autocompleteValue: ''
}

export const autocompleteReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTOCOMPLETE_VALUE:
            return { ...state, autocompleteValue: action.autocompleteValue };
        default:
            return state;
    }
}