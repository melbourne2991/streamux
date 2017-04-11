# Just another redux clone

*This is an experiment, not ready for use in the real world, just use redux :)*

## How to run

1. Clone the repo!
2. `npm install` or `yarn`
3. `npm start`, will boot up the demo page

Thought it would be an interesting experiment to rewrite redux with rxjs. 

## Features

Some of the more interesting features:
- Has undo/redo built in (see `demo/src/index.js` for how to implement it) 
- Returns a stream of states
- actionCreators are inferred from the reducer or can be created explicitly (played around with this idea, but have since decided I don't like it - will remove at some point)
- Can provide reducers as key/value pairs as opposed to a function with a switch statement (where the key is the case and the value is a function returning the updated state, looks a bit tidier but don't really like this either)
- some primitive dev tools that show the history and allow for undo/redo.
- You can return an action from an action creator with an observable as the payload prop, eg:

```
export function fetchJoke() {
  const payload = Rx.Observable.from(fetch('http://api.icndb.com/jokes/random'))
    .mergeMap((response) => response.json())
    .map((json) => json.value.joke)
    .map((payload) => ({
      type: 'RECEIVE_JOKE',
      payload
    }));

  return {
    type: 'FETCH_JOKE',
    payload 
  }
}
```