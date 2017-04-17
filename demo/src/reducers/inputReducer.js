import { reducer } from '../../../lib';

export default reducer({
  initialState: {
    value: 'fake'
  },

  UPDATE_INPUT(state, { payload }) {
    return Object.assign({}, state, {
      value: payload
    });
  }
});