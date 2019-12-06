import React from "react";
import {render} from "react-dom";
import ReactDOM from "react-dom";
import axios from "axios";

export class EmployeeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.list,
      filter: ""
    }

    this.filteredList = this.props.list;
  }

  //check if state should change from new props
  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.list!==prevState.list){
      return { list: nextProps.list};
    }
    else
      return null;
  }

  //if state changes update the employee list
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.list!==this.props.list){
      //Perform some operation here
      this.setState({list: this.props.list});
    }
  }

  //update employee table to match the filter
  filterChange(e){
    console.log(e.target.value);
    console.log(this.state.filter);
    if(e.target.value !== this.state.filter){
      this.setState({
        filter: e.target.value
      });
    }
  }

  //filter the props list into the filteredList which is used to populate the table
  filterList(){
    //loop through list and add matches to filteredList
    if(this.state.filter == ""){
      //short circuit filter since its empty string
      this.filteredList = this.props.list;
      return;
    }

    this.filteredList = [];
    for(let i = 0; i < this.props.list.length; i++){
      let testString = this.props.list[i].first + " " + this.props.list[i].last + " " + this.props.list[i]._id;
      if(testString.toLowerCase().includes(this.state.filter.toLowerCase())){
        //filter matches something in the list entry
        //add it to the filteredList
        this.filteredList.push(this.props.list[i]);
      }
    }
  }

  render () {
    this.filterList();  //filter list before rendering

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h5>Current Employee List</h5>
            <form>
              <div className="form-group">
                <label>Filter</label>
                <input name="filter" className="form-control" placeholder="Filter" value={this.state.filter} onChange={this.filterChange.bind(this)}></input>
              </div>
            </form>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Id</th>
                  <th>Payroll</th>
                </tr>
              </thead>
              <tbody>
                {this.filteredList.map(employee =>
                  <tr key={employee._id}>
                    <td>{employee.first + " " + employee.last}</td>
                    <td>{employee._id}</td>
                    <td><a href={"/employees/payroll/" + employee._id}>Payroll</a></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
