import React from 'react';
import Snapshot from './Snapshot';

const style = {
  background: '#ccc',
  position: 'absolute',
  width: '20%',
  right: 0,
  top: 0,
  bottom: 0
};

export default function DebuggerWindow({ stateHistory, currentState, goToState }) {
  const snapshots = stateHistory.map((state, i) => {
    const isCurrentState = currentState === state;

    return (
      <Snapshot
        onClick={() => goToState(i)}
        currentState={isCurrentState}
        key={i} 
        content={JSON.stringify(state)}/>
    );
  });

  return (
    <div style={style}>
      {snapshots}
    </div>
  )
}