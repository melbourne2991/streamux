import Rx from 'rxjs';

const Streamux = (reducer, options = {}, action$ = new Rx.Subject()) => {
  const reducers = [];
  const actionTypes = {};

  const rootReduce = (state, action) => {
    const nextState = reducer(state, action, actionTypes);
    return Object.assign({}, state, nextState || state);
  };

  const getState$ = (initialState) => action$
    .startWith(initialState)
    .scan(rootReduce);

  const initialState$ = new Rx.Subject();

  const state$= initialState$
    .startWith(undefined)
    .switchMap((state = rootReduce({}, {})) => {
      return getState$(state);
    })

  return {
    createAction(type, fn, callback) {
      actionTypes[type] = type;

      if (callback) {
        return (...args) => {
          // User action kills off redo history.
          callback(...args)
          return action$.next({
            type,
            payload: fn && fn(...args)
          });
        }
      }

      return (...args) => {
        return action$.next({
          type,
          payload: fn && fn(...args)
        });
      }
    },

    resetState(state) {
      initialState$.next(state);
    },
    
    state$
  }
}

export function StateCache$(streamux) {

  const cache = {
    states: [],
    head: null
  };

  const stateCache = bindMethods(cache, {
    createAction(type, fn) {
      return streamux.createAction(type, fn, () => {
        this.clearRedoAndReset();
      });
    },

    getHead() {
      return this.head !== null ? 
      this.head : (this.states.length - 1);
    },

    offset(amount = 0) {
      const head = this.getHead() + amount;
      this.setHead(head);
    },

    setHead(index) {
      const nextState = this.states[index];

      if (nextState) {
        this.head = index;
        streamux.resetState(nextState);
      }
    },

    clearRedoAndReset() {
      // Clear history after current head
      const start = this.getHead() + 1;
      const removeCount = this.states.length - start;
      this.states.splice(start, removeCount);

      // Reset head to default
      this.head = null;
    },

    undo(amount = 1) {
      this.offset(amount * -1);
      return this;
    },

    redo(amount = 1) {
      this.offset(amount);
      return this;
    },

    push(state) {
      !this.states.includes(state) 
      && this.states.push(state);
    },
  });

  stateCache.state$ = streamux.state$.do(stateCache.push);
  
  return stateCache;
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

function bindMethods(obj, methods) {
  Object.keys(methods).forEach((key) => {
    if(methods.hasOwnProperty(key)) {
      const fn = methods[key];
      obj[key] = fn.bind(obj);
    }
  });
  return obj;
}