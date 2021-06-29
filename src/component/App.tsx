import React, { Component } from "react";
import "./../App.css";
import logo from "./logo.svg";
import DemoMaps from './DemoMaps'
import MapWrapper from './Search'

class App extends Component {
  public state = {
    post: "",
    response: "",
    responseToPost: ""
  };
  // public componentDidMount() {
  //   this.callApi()
  //     .then(res => this.setState({ response: res.express }))
  //     // tslint:disable-next-line:no-console
  //     .catch(err => console.log(err));
  // }
  // public callApi = async () => {
  //   const response = await fetch("/api/users/1234");
  //   const body = await response.json();
  //   if (response.status !== 200) {
  //     throw Error(body.message);
  //   }
  //   return body;
  // };
  // public handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   const response = await fetch("/api/messages", {
  //     body: JSON.stringify({ post: this.state.post }),
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     method: "POST"
  //   });
  //   const body = await response.text();
  //   this.setState({ responseToPost: body });
  // };
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
