import { reducer } from '../../../lib';
import Rx from 'rxjs';

export default reducer({
  initialState: {
    jokes: [],
    loading: false
  },

  // getJoke(state, payload) {
  //   return Object.assign({}, state, {
  //     loading: true
  //   });
  // },

  // receiveJoke(state, payload) {
  //   return Object.assign({}, state, {
  //     loading: false
  //   });
  // },
});