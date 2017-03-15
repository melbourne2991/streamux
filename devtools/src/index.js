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

export default (streamux) => {
  streamux
    .observable
    .subscribe((state) => {
      console.log('states', streamux.states);

      renderDebugger({
        stateHistory: streamux.states,
        currentState: state
      });

      // console.log(streamux);
      // ReactDOM.render(
      //   <DebuggerWindow 
      //     stateHistory={streamux.states}
      //     currentState={state}/>,
      //     debuggerMount
      // );
    });
}