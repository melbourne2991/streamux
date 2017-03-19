import { actionCreator } from '../../../lib'
import Rx from 'rxjs';

export function fetchJoke() {
  console.log('in fetchJoke')
  return {
    type: 'FETCH_JOKE',
    payload: Rx.Observable.from(fetch('http://api.icndb.com/jokes/random'))
      .map((response) => {
        console.log(response)
      })
  }
}


// function fetchJoke() {
//   return Rx.Observable.from(fetch('http://api.icndb.com/jokes/random')
//       .map((response) => response.joke)
//       .map(joke => (action(joke)))
// }

// const getJoke = actionCreator('getJoke');

// const actionCreator = (type) => (payload) => {
//   return {
//     type,
//     payload
//   }
// }

// const getJoke = actionCreator('getJoke')


// export function fetchJoke() {
//   return getJoke(Rx.Observable.from(fetch('http://api.icndb.com/jokes/random'))
//     .subscribe((data) => {
//       actions.receiveJoke(data)
//     }))
// }

// export default effects((actions, action$) => ({
//   fetchJoke() {
//     action$.next(getJoke({

//     }));

//     Rx.Observable.from(fetch('http://api.icndb.com/jokes/random'))
//       .subscribe((data) => {
//         actions.receiveJoke(data)
//       });
//   }
// }));