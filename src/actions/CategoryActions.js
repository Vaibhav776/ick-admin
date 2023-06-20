import Helper from '../common/consts/Helper';
import {
    FETCH_CATEGORY_AND_SUBCATEGORY
} from './types';

export const fetchCategories = () => dispatch => {
    dispatch({
        type: FETCH_CATEGORY_AND_SUBCATEGORY,
        payload: [],
        subcategories: [],
        isFetching: true,
        error: false
    });
    let res = Helper('category_and_subcategories_for_admin', 'GET');
    res.then((response) => {
            let responseToDispatch = {
                type: FETCH_CATEGORY_AND_SUBCATEGORY,
                payload: response.categories ? response.categories : [],
                subcategories: response.subcategories ? response.subcategories : [],
                isFetching: false,
                error: response.error ? response.error : false,
            }
            dispatch(responseToDispatch)
        })
        .catch((error) => {
            dispatch({
                type: FETCH_CATEGORY_AND_SUBCATEGORY,
                payload: [],
                subcategories: [],
                isFetching: false,
                error: true
            });
        })
}