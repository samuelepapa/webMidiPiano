import React, { Component } from 'react';
import Piano from './Piano.js'

import Midi from 'webmidi';
import AlertContainer from 'react-alert';
//Experimenting with redux principles (not mutating objects and arrays, using action to trigger a change in the state)
//Experimenting with the use of a top down approach, the container has all the info about the data that comes in
//and manages all the actions, then it passes it to the Piano which has all the presentation capabilities, it generates
// the piano itself and also show the keys currently pressed and the history of keys previously pressed.

//Notes go from 21(-3A) to 108(5C)
class PianoContainer extends Component {
  constructor(prop) {
    super(prop)
    this.state = {
      notes: [],
      history: []
    }
    this.history = [];
  }
  componentDidMount() {
    //Probably avoidable.
    let self = this;
    //Enable midi and add the listeners
    Midi.enable(function (err) {
      if (err) {
        self.msg.show('The WebMidi API is could not be enabled in this browser.', {
            time: 0,
            type: 'error'
          })
        console.log("WebMidi could not be enabled.", err);
      } else {
        console.log("WebMidi enabled!");

        let input = Midi.inputs[0];
        if (input === undefined) {
          self.msg.show('There is no piano connected, but you can still interact by clicking.', {
            time: 10000,
            type: 'info'
          })
        } else {
          input.addListener('noteon', "all", function (e) { self.handleNoteDown(e) });
          input.addListener('noteoff', "all", function (e) { self.handleNoteUp(e) });
        }
      }

    });
  }
  handleNoteDown(e) {
    this.setState((prevState, props) => {
      let history = prevState.history;

      history[e.note.number] = (prevState.history[e.note.number] + 1) || 1;

      //flag is true if the note is not already present (this check should not be necessary if I completly)
      //trusted the order in which things are fired from the event queue
      let flag = true;
      for (let a = 0; a < prevState.notes.length; a++) {
        if (prevState.notes[a].number === e.note.number)
          flag = false
      }
      let notes = []
      //Add note to notes only if it's not already there
      if (flag) {
        notes = prevState.notes.concat(e.note)
      }
      return {
        notes: notes,
        history: history
      }
    })
  }
  handleNoteUp(e) {
    this.setState((prevState, props) => {
      //Remove notes
      let notes = []
      for (let a = 0; a < prevState.notes.length; a++) {
        if (prevState.notes[a].number === e.note.number) {
          notes = prevState.notes.slice(0, a).concat(prevState.notes.slice(a + 1, prevState.notes.length))
        }
      }
      return {
        notes: notes,
      }
    })
  }
  componentWillUnmount() {
    Midi.disable();
  }
  alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'light',
    time: 5000,
    transition: 'fade'
  }
  render() {
    return (
      <div className="note">
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <Piano notes={this.state.notes} history={this.state.history} onMouseDown={(e) => this.handleNoteDown(e)} onMouseUp={(e) => this.handleNoteUp(e)} ></Piano>
      </div>
    )
  }
}

export default PianoContainer;