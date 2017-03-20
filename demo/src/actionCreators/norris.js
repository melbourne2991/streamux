import { actionCreator } from '../../../lib'
import Rx from 'rxjs';

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