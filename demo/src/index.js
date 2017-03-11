import './global.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Streamux from '../../lib';
import App from './App';

const mount = document.getElementById('mount');
const streamux = Streamux();

// (actions, on) => (state = { count: 0 }, action) => {
//   on(actions.INCREMENT, Object.assign({}, state, {
//     count: state.count + 1
//   }))

//   on(actions.DECREMENT, Object.assign({}, state, {
//     count: state.count - 1
//   }))
// }

// (actions, on, root) => (state =  {}, action) => {
//   root({
//     counter
//   });
// }

streamux.addReducer('counter', (state = { count: 0 }, action) => {
  if (action.name === 'INCREMENT') {
    return Object.assign({}, state, {
      count: state.count + 1
    });
  }

  if (action.name === 'DECREMENT') {
    return Object.assign({}, state, {
      count: state.count - 1
    });
  }

  return state;
});

const increment = streamux.bindAction(() => {
  return {
    name: 'INCREMENT'
  }
});

const decrement = streamux.bindAction(() => {
  return {
    name: 'DECREMENT'
  }
});

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

