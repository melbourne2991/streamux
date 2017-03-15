import './global.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Streamux from '../../lib';
import App from './App';
import devtools from '../../devtools/dist/bundle.js';

const mount = document.getElementById('mount');
const streamux = Streamux(Streamux.combine({
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

const increment = streamux.createAction('INCREMENT');
const decrement = streamux.createAction('DECREMENT');

const undo = () => {
  streamux.undo(1);
}

const redo = () => {
  streamux.redo(1);
}

streamux
  .observable
  .subscribe((state) => {
    console.log(state);
    ReactDOM.render(<App 
      {...state}
      actions={{ 
        increment, 
        decrement, 
        redo, 
        undo 
      }}/>, mount);
  });

devtools(streamux);
