import React from 'react';
import ReactDOM from 'react-dom';
import DebuggerWindow from './DebuggerWindow';

const debuggerMount = document.createElement('div');
document.body.appendChild(debuggerMount);

const renderDebugger = (props) => {
  ReactDOM.render(
    <DebuggerWindow {...props}/>, 
    debuggerMount
  );
}

renderDebugger({
  stateHistory: [],
  currentState: null
});

export default (stateCache) => {
  return {
    state$: stateCache
      .state$
      .do((state) => {
        renderDebugger({
          goToState: (stateIndex) => stateCache.setHead(stateIndex),
          stateHistory: stateCache.states,
          currentState: state
        });
      })
  }
}