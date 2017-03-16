import React from 'react';

export default ({ actions, counter }) => {
  return (
    <div>
      <div>Counter: { counter.count }</div>
      <button onClick={actions.increment}>Increment</button>
      <button onClick={actions.decrement}>Decrement</button>
      <button onClick={actions.undo}>Undo</button>
      <button onClick={actions.redo}>Redo</button>
      <input type="text" onKeyPress={(e) => {
        console.log(e);
        console.log(e.target.value);
      }}/>
    </div>
  )
}