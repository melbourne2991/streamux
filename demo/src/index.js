import './global.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore, { combine, reducer, recordState$ } from '../../lib';
import * as reducers from './reducers';
import App from './App';
import devtools from '../../devtools/dist/bundle.js';
import * as effects from './effects';

const mount = document.getElementById('mount');
const store = createStore(combine(reducers), effects);
const cache = recordState$(store)

const undo = () => {
  cache.undo(1);
};

const redo = () => {
  cache.redo(1);
};

const actions = Object.assign({undo, redo}, store.actions);

devtools(cache)
  .subscribe((state) => {
    ReactDOM.render(<App 
      {...state}
      actions={actions}/>, mount);
  });



// devtools(streamux, cache);
