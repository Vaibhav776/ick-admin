import Helper from '../common/consts/Helper';
import {
    ADD_SLIDER,
    FETCH_SLIDER
} from './types';

export const fetchSliders = () => dispatch => {
    dispatch({
        type: FETCH_SLIDER,
        payload: [],
        isFetching: true,
        error: false
    });
    let res = Helper('slide', 'GET');
    res.then((response) => {
            let responseToDispatch = {
                type: FETCH_SLIDER,
                payload: response.data ? response.data : [],
                isFetching: false,
                error: response.error ? response.error : false,
            }
            dispatch(responseToDispatch)
        })
        .catch((error) => {
            dispatch({
                type: FETCH_SLIDER,
                payload: [],
                isFetching: false,
                error: true
            });
        })
};

export const addSlide = (body) => dispatch => {
    dispatch({
        type: ADD_SLIDER,
        payload: false,
        error: false,
        isAdding: true
    });
    let res = Helper('slide', 'POST', body, true);
    res.then((response) => {
            dispatch({
                type: ADD_SLIDER,
                payload: response.error ? false : true,
                error: response.error,
                isAdding: false
            });
            if (!response.error) dispatch(fetchSliders())
        })
        .catch(() => {
            dispatch({
                type: ADD_SLIDER,
                payload: false,
                error: true,
                isAdding: false
            });
        })
}