import {
    FETCH_CATEGORY_AND_SUBCATEGORY,
} from "../actions/types";

const initialState = {

    isFetching: false,
    categories: [],
    subcategories: [],
    errorFetching: false,

};

export default function (state = initialState, action) {
    switch (action.type) {
        case `${FETCH_CATEGORY_AND_SUBCATEGORY}`:
            return {
                ...state,
                isFetching: action.isFetching,
                categories: action.payload,
                subcategories: action.subcategories,
                errorFetchingSlider: action.error
            }
        default:
            return {
                ...state
            };
    }
}