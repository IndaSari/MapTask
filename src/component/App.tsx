import React, { Component } from "react";
import "./../App.css";
import DemoMaps from './DemoMaps'

class App extends Component {

  public render() {
    return (
      <div className="App">
          <p>
            Please choose your location
          </p>
          <DemoMaps />
      </div>
    );
  }
}

export default App;
