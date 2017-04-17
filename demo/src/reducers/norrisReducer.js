import { reducer } from '../../../lib';
import Rx from 'rxjs';

export default reducer({
  initialState: {
    jokes: [],
    loading: false
  },

  FETCH_JOKE(state, { payload }) {
    return Object.assign({}, state, {
      loading: true
    });
  },

  RECEIVE_JOKE(state, { payload }) {
    return Object.assign({}, state, {
      loading: false,
      jokes: state.jokes.concat([payload])
    });
  }
});