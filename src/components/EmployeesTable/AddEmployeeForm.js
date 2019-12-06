import React from "react";
import {render} from "react-dom";
import ReactDOM from "react-dom";
import axios from "axios";

export class AddEmployeeForm extends React.Component {
  constructor(props) {
    super();
    this.state = {
      first: "",
      last: ""
    }
  }

  onChange(e) {
    //determine which text input is changing
    if(e.target.name === "first"){
      if(e.target.value !== this.state.first){
        this.setState({
          first: e.target.value
        });
      }
    }
    else if(e.target.name === "last"){
      if(e.target.value !== this.state.last){
        this.setState({
          last: e.target.value
        });
      }
    }
  }

  //clear text entries
  onCancel(){
    this.setState({
      first: "",
      last: ""
    });
  }

  //create new employee
  onSubmit(){
    if(this.state.first == "" || this.state.last == ""){
      window.alert('First and Last names are required.');
      return;
    }

    axios.post('/api/employees', {
      first: this.state.first,
      last: this.state.last
    })
    .then(
      response => {
        this.setState({
          first: "",
          last: ""
        });
        //add employee to list in parent component
        this.props.addEmployee(response.data);
      },
      error => {
        window.alert('Could not create employee.');
      }
    );
  }

  render () {
    return (
      <div className="col">
        <h5>Create New Employee</h5>
        <form>
          <div className="form-group">
            <label>First Name</label>
            <input name="first" className="form-control" placeholder="First Name" value={this.state.first} onChange={this.onChange.bind(this)}></input>
          </div>
          <div className="form-group">
          <label>Last Name</label>
          <input name="last" className="form-control" placeholder="Last Name" value={this.state.last} onChange={this.onChange.bind(this)}></input>
          </div>
          <div className="button-group my-1">
            <button type="button" className="btn btn-success mr-1" onClick={this.onSubmit.bind(this)}>Submit</button>
            <button type="button" className="btn btn-danger" onClick={this.onCancel.bind(this)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}
