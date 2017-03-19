import './global.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore, { combine, reducer, recordState$ } from '../../lib';
import * as reducers from './reducers';
import App from './App';
import devtools from '../../devtools/dist/bundle.js';

const mount = document.getElementById('mount');
const store = createStore(combine(reducers));
const cache = recordState$(store)

const undo = () => {
  cache.undo(1);
};

const redo = () => {
  cache.redo(1);
};

devtools(cache)
  .subscribe((state) => {
    ReactDOM.render(<App 
      {...state}
      actions={{
        updateInput: store.actions.updateInput,
        increment: store.actions.increment, 
        decrement: store.actions.decrement,
        getJoke: store.actions.getJoke,
        redo, 
        undo,
      }}/>, mount);
  });



// devtools(streamux, cache);
