import './global.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Streamux, { combine, StateCache$ } from '../../lib';
import App from './App';
import devtools from '../../devtools/dist/bundle.js';

const mount = document.getElementById('mount');

const streamux = Streamux(combine({
  counter
}), {
  debug: true
});

function counter(state = { count: 0 }, action, types) {
  const { 
    INCREMENT, 
    DECREMENT 
  } = types;

  switch(action.type) {
    case INCREMENT:
      return Object.assign({}, state, {
        count: state.count + 1
      });
    case DECREMENT: 
      return Object.assign({}, state, {
        count: state.count - 1
      });    
    default:
      return state;
  }
}


const stateCache = StateCache$(streamux);


const increment = stateCache.createAction('INCREMENT');
const decrement = stateCache.createAction('DECREMENT');

const undo = () => {
  stateCache.undo(1);
};

const redo = () => {
  stateCache.redo(1);
};

devtools(stateCache)
  .subscribe((state) => {
    ReactDOM.render(<App 
      {...state}
      actions={{ 
        increment, 
        decrement, 
        redo, 
        undo 
      }}/>, mount);
  });



// devtools(streamux, cache);
