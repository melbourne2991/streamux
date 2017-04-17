import { reducer } from '../../../lib';

export default reducer({
  initialState: { 
    count: 0 
  },

  INCREMENT(state, { payload }) {
    return Object.assign({}, state, {
      count: state.count + 1
    });
  },

  DECREMENT(state, { payload }) {
    return Object.assign({}, state, {
      count: state.count - 1
    });
  }
});