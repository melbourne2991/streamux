import Rx from 'rxjs';

const createStore = (reducer, actionCreators, options = {}, action$ = new Rx.Subject()) => {
  const actions = {};

  bindActionCreators(action$, actionCreators, actions);

  const rootReduce = (state, action) => {
    const nextState = reducer(state, action);
    return Object.assign({}, state, nextState || state);
  };

  const getState$ = (initialState) => action$
    .mergeMap(ensureObservable)
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
    state$,
    action$
  }
}

export function recordState(store) {
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
        store.resetState(nextState);
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

  stateCache.state$ = store.state$.do(stateCache.push);
  
  return stateCache;
}

export function bindActionCreators(action$, actionCreators, actions) {
  Object.keys(actionCreators).forEach((actionCreatorKey) => {
    const actionCreator = actionCreators[actionCreatorKey];

    if(isFunc(actionCreator) && actions) {
      return actions[actionCreatorKey] = bindActionCreator(action$, actionCreator, actions);
    }

    return bindActionCreators(action$, actionCreator, actions);
  });
}

export function bindActionCreator(action$, actionCreator) {
  return (...args) => {
    const nextAction = actionCreator(...args);
    action$.next(nextAction);
    if (isObservable(nextAction.payload)) {
      action$.next(nextAction.payload);
    }
  }
}

export function combineReducers(reducerMap) {
  const reducerKeys = Object.keys(reducerMap);

  return (state = {}, action) => {
    const nextState = {};

    reducerKeys.forEach(key => {
      const reducer = reducerMap[key];
      nextState[key] = reducer(state[key], action);
    });

    return nextState;
  }
}


export function reducer(blueprint) {
  if (typeof blueprint === 'function') {
    return blueprint;
  }

  const { initialState } = blueprint;

  const actionTypes = Object.keys(blueprint).filter(actionType => {
    return actionType !== 'initialState';
  });

  return (state = initialState, action) => {
    let nextState = state;

    actionTypes.forEach((key) => {
      if(key === action.type) {
        nextState = blueprint[key](state, action);
      }
    });

    return nextState;
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

function isFunc(obj) {
 return (typeof obj === 'function');
}

function isObservable(obj) {
  return Rx.Observable.prototype.isPrototypeOf(obj);
}

function ensureObservable(obj) {
  if (isObservable(obj)) return obj;
  return Rx.Observable.of(obj);
}