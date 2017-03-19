import Rx from 'rxjs';

const createStore = (bindReducer, options = {}, action$ = new Rx.Subject()) => {
  const reducers = [];
  const actions= {};

  const reducer = bindReducer(actions, action$);

  const rootReduce = (state, action) => {
    const nextState = reducer(state, action);
    return Object.assign({}, state, nextState || state);
  };

  const getState$ = (initialState) => action$
    .startWith(initialState)
    .scan(rootReduce);

  const initialState$ = new Rx.Subject();

  const state$ = initialState$
    .startWith(undefined)
    .switchMap((state = rootReduce({}, {})) => {
      return getState$(state);
    });

  return {
    resetState(state) {
      initialState$.next(state);
    },

    actions,
    state$
  }
}

export function recordState$(streamux) {
  const cache = {
    states: [],
    head: 0
  };

  const stateCache = bindMethods(cache, {
    offset(amount = 0) {
      const head = this.head + amount;
      this.setHead(head);
    },

    setHead(index) {
      const nextState = this.states[index];

      if (nextState) {
        this.head = index;
        streamux.resetState(nextState);
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

    push(state) {
      if(!this.states.includes(state)) {
        // If head is not last in stack, 
        // cut off everything after head (clear redo history)
        if(this.head !== this.states.length - 1) {
          const start = this.head + 1;
          const removeCount = this.states.length - start;
          this.states.splice(start, removeCount);
        }

        const length = this.states.push(state);
        this.head = length - 1;
      }
    },
  });

  stateCache.state$ = streamux.state$.do(stateCache.push);
  
  return stateCache;
}

export function combine(bindReducerMap) {
  return (actions, action$) => {
    const boundReducers = {};

    Object.keys(bindReducerMap).forEach((key) => {
      boundReducers[key] = bindReducerMap[key](actions, action$);
    })

    return (state = {}, action) => {
      const nextState = {};

      Object.keys(boundReducers).forEach(key => {
        const reducer = boundReducers[key];
        nextState[key] = reducer(state[key], action);
      });

      return nextState;
    }

  }
}

export function reducer(blueprint) {
  return (actions, action$) => {
    const { initialState } = blueprint;

    Object.keys(blueprint).forEach((key) => {
      actions[key] = (payload) => {
        action$.next({
          type: key,
          payload
        });
      }
    });

    return (state = initialState, action) => {
      let nextState = state;

      Object.keys(blueprint).forEach((key) => {
        if(key === action.type) {
          nextState = blueprint[key](state, action.payload);
        }
      });

      return nextState;
    }
  }
}

export default createStore;

function bindMethods(obj, methods) {
  Object.keys(methods).forEach((key) => {
    if(methods.hasOwnProperty(key)) {
      const fn = methods[key];
      obj[key] = fn.bind(obj);
    }
  });
  return obj;
}