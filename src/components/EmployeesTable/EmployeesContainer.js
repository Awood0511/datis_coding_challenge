import React from "react";
import {render} from "react-dom";
import ReactDOM from "react-dom";
import axios from "axios";
import {AddEmployeeForm} from "./AddEmployeeForm";
import {EmployeeTable} from "./EmployeeTable";

export class EmployeesContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      employeeList: false,
    }
    this.employees = [];
  }

  //get list of employees from database
  componentDidMount(){
    axios.get('/api/employees')
    .then(
        response => {
          this.employees = response.data;
          this.setState({
            employeeList: true
          });
        },
        error => {
          window.alert("Could not get the employee list.");
        }
    );
  }

  addEmployee(newEmployee){
    this.employees.push(newEmployee);
    console.log(this.employees);
    this.forceUpdate();
  }

  render() {
    if(this.state.employeeList === false){
      return (
        <></>
      );
    }
    return (
      <div className="container">
        <div className="row justify-content-center my-4">
          <AddEmployeeForm addEmployee={this.addEmployee.bind(this)}/>
        </div>
        <div className="row justify-content-center my-4">
          <EmployeeTable list={this.employees}/>
        </div>
      </div>
    );
  }
}

if(window.document.getElementById("employees"))
  ReactDOM.render(<EmployeesContainer/>, window.document.getElementById("employees"));
