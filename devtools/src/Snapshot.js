import React from 'react';

export default function Snapshot({ content, currentState, onClick }) {
  const styles = {};

  if(currentState === true) {
    styles.backgroundColor = 'green';
  }

  return (
    <div style={styles} onClick={onClick}>
      <div>{ content }</div>
    </div>
  );
}