import Rx from 'rxjs';

const Streamux = (reducer, action$ = new Rx.Subject()) => {
  const reducers = [];
  const states = [];
  const actionTypes = {};

  const rootReduce = (state, action) => {
    const nextState = reducer(state, action, actionTypes);
    return Object.assign({}, state, nextState || state);
  };

  const getState$ = (initialState) => action$
  .startWith(initialState)
  .scan(rootReduce);

  const initialState$ = new Rx.Subject();

  return {
    head: null,

    getHead() {
      return this.head !== null ? 
      this.head : (states.length - 1);
    },

    offset(amount) {
      const head = this.getHead() + amount
      const nextState = states[head];

      if(nextState) {
        this.head = head;
        initialState$.next(nextState);
      }
    },

    undo(amount = 1) {
      this.offset(amount * -1);
      return this;
    },

    redo(amount = 1) {
      this.offset(amount);
      return this;
    },

    clearRedoAndReset() {
      // Clear history after. current head
      const start = this.getHead() + 1; // 1
      const removeCount = states.length - start;
      states.splice(start, removeCount);

      // Reset head to default
      this.head = null;
    },

    createAction(type, fn) {
      actionTypes[type] = type;

      return (...args) => {
        // User action kills off redo history.
        this.clearRedoAndReset();
        return action$.next({
          type,
          payload: fn && fn(...args)
        });
      }
    },

    observable: initialState$
      .startWith(undefined)
      .switchMap((state = rootReduce({}, {})) => {
        return getState$(state);
      })
      .do((state) => {
        !states.includes(state) 
        && states.push(state);
      })
  }
}

export function combine(reducersMap) {
  return (state, action, types) => {
    const nextState = {};

    Object.keys(reducersMap).forEach(key => {
      const reducer = reducersMap[key];
      nextState[key] = reducer(state[key], action, types);
    });

    return nextState;
  }
}

Streamux.combine = combine;

export default Streamux;