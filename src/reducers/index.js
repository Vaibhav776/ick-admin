import { combineReducers } from 'redux';

//reducers
import CategoryReducer from './CategoryReducer';
import SliderReducer from './SliderReducer';

export default combineReducers({
    Slider: SliderReducer,
    Category: CategoryReducer
})