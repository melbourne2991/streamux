import React, { Component } from 'react';
import Snapshot from './Snapshot';
import Rx from 'rxjs';

const style = {};

style.debuggerWindow = {
  background: '#272822',
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0
};

style.resizeBar = {
  padding: '3px',
  height: '100%',
  cursor: 'pointer',
  background: '#000',
  position: 'absolute',
  left: '0',
  cursor: 'col-resize'
}

style.snapshots = {
  width: '100%',
  padding: '5px',
  height: '100%',
  overflowY: 'scroll'
}

export default class DebuggerWindow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sidebarWidth: 300
    }
  }

  componentDidMount() {
    const { resizeBar } = this.refs;
    const minwidth = 300;

    const mousedown = Rx.Observable.fromEvent(resizeBar, 'mousedown');
    const mouseup = Rx.Observable.fromEvent(document, 'mouseup');
    const mousemove = Rx.Observable.fromEvent(document, 'mousemove');

    const mousedrag = mousedown.mergeMap((md) => {
      md.preventDefault();

      const initialPosition = md.screenX;
      const initialWidth = this.state.sidebarWidth;

      return mousemove.map((mm) => {
        const delta = initialWidth + (initialPosition - mm.screenX);
        return delta;
      })
      .filter((width) => width > minwidth)
      .takeUntil(mouseup)
    });

    this.unsubscribeMousedrag = mousedrag.subscribe((val) => {
      this.setState({
        sidebarWidth: val
      });
    })
  }

  componentWillUnmount() {
    this.unsubscribeMousedrag();
  }

  getSnapshots() {
    const snapshots = this.props.stateHistory.map((state, i) => {
      const isCurrentState = this.props.currentState === state;

      return (
        <Snapshot
          onClick={() => this.props.goToState(i)}
          currentState={isCurrentState}
          key={i} 
          content={state}/>
      );
    });

    return snapshots;
  }

  render() {
    const snapshots = this.getSnapshots();

    return (
      <div style={Object.assign({}, style.debuggerWindow, { width: this.state.sidebarWidth + 'px' })}>
        <div style={style.resizeBar} ref="resizeBar">
        </div>
        <div style={style.snapshots}>
          {snapshots}
        </div>
      </div>
    )
  }
}