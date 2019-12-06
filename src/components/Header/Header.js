import React from "react";
import axios from "axios";
import {render} from "react-dom";
import ReactDOM from 'react-dom';
import {UserControl} from "./UserControl";

export class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null
    };
  }

  getUser(){
    axios.get("/api/login").then(
      response => {
        //save user information
        if(response.data === null){
          this.setState({
            username: response.data
          });
        }
        else{
          this.setState({
            username: response.data.username
          });
        }
      },
      error => {
        this.setState({
          username: null
        });
      }
    );
  }

  componentDidMount() {
    this.getUser();
  }

  render() {
    if(this.state.username === null){
      return (
        <div className="mb-4">
          <nav className="navbar navbar-expand-md navbar-dark bg-dark justify-content-between">
              <div className="navbar-header">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item active">
                    <a className="nav-link" href="/">Home</a>
                  </li>
                </ul>
              </div>
              <UserControl username={this.state.username} getUser={this.getUser.bind(this)}/>
          </nav>
        </div>
      );
    }
    else{
      return(
        <div className="mb-4">
          <nav className="navbar navbar-expand-md navbar-dark bg-dark justify-content-between">
              <div className="navbar-header">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item active">
                    <a className="nav-link" href="/">Home</a>
                  </li>
                  <li className="nav-item active">
                    <a className="nav-link" href="/employees">Employees</a>
                  </li>
                </ul>
              </div>
              <UserControl username={this.state.username} getUser={this.getUser.bind(this)}/>
          </nav>
        </div>
      );
    }
  }
}

if(window.document.getElementById("header"))
  ReactDOM.render(<Header/>, window.document.getElementById("header"));
