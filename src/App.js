import React, { Component } from 'react';
import PianoContainer from './PianoContainer.js'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>the keys you pressed.</h2>
        </div>
        <PianoContainer></PianoContainer>
      </div>
    );
  }
}

export default App;
