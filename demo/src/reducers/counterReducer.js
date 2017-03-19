import { reducer } from '../../../lib';

export default reducer({
  initialState: { 
    count: 0 
  },

  increment(state, payload) {
    return Object.assign({}, state, {
      count: state.count + 1
    });
  },

  decrement(state, payload) {
    return Object.assign({}, state, {
      count: state.count - 1
    });
  }
});