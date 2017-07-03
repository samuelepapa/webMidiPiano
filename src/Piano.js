import React, { Component } from "react";
//I use a presentational and container component approach, details https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0

//Component for the key
function Key(prop) {
  let pressed = "not-pressed";
  for (let a in prop.notes) {
    if (prop.notes[a].number === prop.keys.note) {
      pressed = "pressed";
    }
  }

  return (
    <div className={"key " + prop.keys.position + " note" + (prop.keys.note % 12) + " " + pressed} onMouseDown={prop.onMouseDown} onMouseUp={prop.onMouseUp}>
      &nbsp;
    </div>
  );
}

//dynamic component, generates a list of components based on the number in the argument
function repeatTimes(n) {
  let notes = []
  while (n--) {
    notes[n] = (<div className={"historyElement"} key={n}>&nbsp;</div>)
  }
  return notes;
}

//Container of the keys previously pressed
function History(prop) {
  return (
    <div className={"history " + prop.keys.position + " note" + (prop.keys.note % 12)}>
      {repeatTimes(prop.history[prop.keys.note])} 
    </div>

  )
}

class Piano extends Component {
  constructor(props) {
    super(props)

    //Generate the keyboard.
    let tempKeys = []
    for (let i = 21; i < 109; i++) {
      let note = i % 12;
      let position = "";
      switch (note) {
        case 0: case 5:
          position = "right white";
          break;
        case 1: case 6:
          position = "right black";
          break;
        case 4: case 11:
          position = "left white";
          break;
        case 3: case 10:
          position = "left black";
          break;
        case 2: case 7: case 9:
          position = "mid white";
          break;
        case 8:
          position = "mid black";
          break;

        default:
          position = "error-NotAPositionSeePianojs";
      }
      tempKeys[i] = { position: position, note: i, life: 0 };
    }
    this.state = {
      keys: tempKeys
    }
  }
  render() {
    //local copies of props
    let notes = this.props.notes;
    let history = this.props.history;
    let localProps = this.props;

    return (
      <div className="piano">
        <div className="history">
          {this.state.keys.map(function (object, i) {
            return <History keys={object} history={history} key={i} />;
          })}
        </div>
        <div className="keys">
          {this.state.keys.map(function (object, i) {
            return <Key notes={notes} keys={object} key={i} onMouseDown={() => localProps.onMouseDown({ note: { number: object.note } })} onMouseUp={() => localProps.onMouseUp({ note: { number: object.note } })} />;
          })}
        </div>
      </div>

    )
  }

}

export default Piano;