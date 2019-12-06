import React from "react";
import {render} from "react-dom";
import ReactDOM from "react-dom";
import axios from "axios";

export class SignupForm extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      passwordC: ""
    }
  }

  onChange(e) {
    //determine which text input is changing
    if(e.target.name === "user"){
      if(e.target.value !== this.state.username){
        this.setState({
          username: e.target.value
        });
      }
    }
    else if(e.target.name === "pass"){
      if(e.target.value !== this.state.password){
        this.setState({
          password: e.target.value
        });
      }
    }
    else if(e.target.name === "passC"){
      if(e.target.value !== this.state.passwordC){
        this.setState({
          passwordC: e.target.value
        });
      }
    }
  }

  handlePost(e) {
    //verify that the account information is legal
    if(this.state.password.length < 4 || this.state.password.length > 50){
      window.alert("Password must be 4 characters minimum, 50 characters maximum.");
    }
    else if(this.state.username.length < 4 || this.state.username.length > 50){
      window.alert("Username must be 4 characters minimum, 50 characters maximum.");
    }
    else if(this.state.password !== this.state.passwordC){
      window.alert("Passwords must match.");
    }
    else{
      axios.post('/api/signup', {
        username: this.state.username,
        password: this.state.password
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error.respose.data);
      });
    }
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <form>
              <div className="form-group">
                <label>Username</label>
                <input type="text" name="user" className="form-control" placeholder="Username" value={this.state.username} onChange={this.onChange.bind(this)}></input>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="pass" className="form-control" placeholder="Password" value={this.state.password} onChange={this.onChange.bind(this)}></input>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" name="passC" className="form-control" placeholder="Confirm Password" value={this.state.passwordC} onChange={this.onChange.bind(this)}></input>
              </div>
              <div className="button-group my-1">
                <button className="button-signup" onClick={this.handlePost.bind(this)}>Create Account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

if(window.document.getElementById("signup"))
  ReactDOM.render(<SignupForm/>, window.document.getElementById("signup"));
