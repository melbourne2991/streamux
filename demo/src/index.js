import './global.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore, { combineReducers, recordState } from '../../lib';
import * as reducers from './reducers';
import App from './App';
import devtools from '../../devtools/dist/bundle.js';
import * as actionCreators from './actionCreators';

const mount = document.getElementById('mount');
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