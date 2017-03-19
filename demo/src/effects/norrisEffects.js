import { effects } from '../../../lib';

export default effects((actions) => ({
  fetchJoke() {
    actions.getJoke();

    Rx.Observable.from(fetch('http://api.icndb.com/jokes/random'))
      .subscribe((data) => {
        actions.receiveJoke(data)
      });
  }
}));