import { reducer } from '../../../lib';

export default reducer({
  initialState: {
    value: 'fake'
  },

  updateInput(state, payload) {
    return Object.assign({}, state, {
      value: payload
    });
  }
});