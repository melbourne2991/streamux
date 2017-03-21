import React from 'react';
import { AllHtmlEntities } from 'html-entities'

const entities = new AllHtmlEntities();

export default ({ actions, counter, input, norris }) => {
  const jokes = norris.jokes.map((joke, i) => {
    return <div key={i}>{entities.decode(joke)}</div>
  });

  return (
    <div>
      <div>Counter: { counter.count }</div>
      <button onClick={actions.increment}>Increment</button>
      <button onClick={actions.decrement}>Decrement</button>
      <button onClick={actions.undo}>Undo</button>
      <button onClick={actions.redo}>Redo</button>
      <input type="text" value={input.value} onChange={(e) => {
        actions.updateInput(e.target.value);
      }}/>

      <button onClick={() => actions.fetchJoke()}>Get norris</button>

      {jokes}
    </div>
  )
}