import {
  ADD_SLIDER,
  FETCH_SLIDER,
} from "../actions/types";

const initialState = {

  isFetching: false,
  sliders: [],
  errorFetchingSlider: false,

  isAdding: false,
  addedSuccess: false,
  errorAddingSlider: false,

  isDeleting: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    //update add color response 
    case `${FETCH_SLIDER}`:
      return {
        ...state,
        isFetching: action.isFetching,
        sliders: action.payload,
        errorFetchingSlider: action.error
      }
    case `${ADD_SLIDER}`:
      return {
        ...state,
        isAdding: action.isAdding,
        addedSuccess: action.payload,
        errorAddingSlider: action.error
      }

    default:
      return {
        ...state
      };
  }
}