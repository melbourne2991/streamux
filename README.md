# Just another redux clone

Very similar to redux except it uses RxJS to return a state$ Observable.
*This is an experiment, not ready for use in the real world, just use redux :)*

## Run Demo

1. Clone the repo!
2. `npm install` or `yarn`
3. Build dev tools `npm run build:devtools`
4. `npm start`, will boot up the demo page

Thought it would be an interesting experiment to rewrite redux with rxjs. 

## Features

Some of the more interesting features:
- Has undo/redo built in (see `demo/src/index.js` for how to implement it) 
- Returns a stream of states
- Can provide reducers as key/value pairs as opposed to a function with a switch statement (where the key is the case and the value is a function returning the updated state, looks a bit tidier but don't really like this either)
- some primitive dev tools that show the history and allow for undo/redo.
- You can return an action from an action creator with an observable as the payload prop, eg:

```
export function fetchJoke() {
  const payload = Rx.Observable.from(fetch('http://api.icndb.com/jokes/random'))
    .mergeMap((response) => response.json())
    .map((json) => json.value.joke)
    .map((payload) => ({
      type: 'RECEIVE_JOKE',
      payload
    }));

  return {
    type: 'FETCH_JOKE',
    payload 
  }
}
```

## Usage

### Basic usage

```
import createStore, { combineReducers } from '../../lib'; // not yet published to npm
import * as actionCreators from './actionCreators';
import * as reducers from './reducers';

// Pass reducer and actionCreators createStore.
// Passing actions creators differs slightly from redux, here it automatically binds them to the store
// and exposes them on store.actions. If you prefer to bind it yourself you can import
// bindActionCreator(store.action$, actionCreator);

const store = createStore(combineReducers(reducers), actionCreators);
const { actions } = store.actions; // bound actions

store
  .state$
  .subscribe((state) => {
    ReactDOM.render(<App 
      {...state}
      actions={actions}/>, mount);
  });
```

### Undo/Redo

```
import createStore, { combineReducers, RecordState } from '../../lib'; // not yet published to npm
import * as actionCreators from './actionCreators';
import * as reducers from './reducers';

const store = createStore(combineReducers(reducers), actionCreators);
const cache = recordState(store)

const undo = () => {
  cache.undo(1);
};

const redo = () => {
  cache.redo(1);
};

const actions = Object.assign({undo, redo}, store.actions);

cache
  .state$
  .subscribe((state) => {
    ReactDOM.render(<App 
      {...state}
      actions={actions}/>, mount);
  });
```

### With devtools

```
import devtools from '../../devtools/dist/bundle.js';
import createStore, { combineReducers, RecordState } from '../../lib'; // not yet published to npm
import * as actionCreators from './actionCreators';
import * as reducers from './reducers';

const store = createStore(combineReducers(reducers), actionCreators);
const cache = recordState(store)

const undo = () => {
  cache.undo(1);
};

const redo = () => {
  cache.redo(1);
};

const actions = Object.assign({undo, redo}, store.actions);

devtools(cache)
  .state$
  .subscribe((state) => {
    ReactDOM.render(<App 
      {...state}
      actions={actions}/>, mount);
  });
```

## Reducers
You can define reducers the traditional redux way (just a function), or you can express them as an object like so:
```
import { reducer } from '../../../lib';
import { INCREMENT, DECREMENT } from '../actionTypes';

export default reducer({
  initialState: { 
    count: 0 
  },

  [INCREMENT](state, { payload }) {
    return Object.assign({}, state, {
      count: state.count + 1
    });
  },

  [DECREMENT](state, { payload }) {
    return Object.assign({}, state, {
      count: state.count - 1
    });
  }
});
```

