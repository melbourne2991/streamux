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

export default function DebuggerWindow({ stateHistory, currentState }) {
  const snapshots = stateHistory.map((state, i) => {
    return (
      <Snapshot 
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