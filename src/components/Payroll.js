import React from "react";
import {render} from "react-dom";
import ReactDOM from "react-dom";
import axios from "axios";

export class Payroll extends React.Component {
  constructor() {
    super();
    this.state = {
      salary: 0.0,
      hours: 80,
      bonus: 0.0,
      reimburse: 0.0,
      miles: 0,
      medical: 0.0,
      dental: 0.0,
      vision: 0.0,
      k401: 0.0,
      payInfo: false
    }

    //get id from url
    this.URL_id = location.pathname.replace('/employees/payroll/', '');
  }

  //get employees saved payroll information
  componentDidMount(){
    axios.get('/api/employees/payroll/' + this.URL_id)
    .then(
        response => {
          this.setState({
            salary: response.data.salary,
            hours: response.data.hours,
            bonus: response.data.bonus,
            reimburse: response.data.reimburse,
            miles: response.data.miles,
            medical: response.data.medical,
            dental: response.data.dental,
            vision: response.data.vision,
            k401: response.data.k401,
            payInfo: true
          });
        },
        error => {
          window.alert("Could not get the employee pay information.");
        }
    );
  }

  //send the current payInfo to be saved to database
  updatePayrollInfo(){
    axios.post('/api/employees/payroll/' + this.URL_id, {
      salary: this.state.salary,
      hours: this.state.hours,
      bonus: this.state.bonus,
      reimburse: this.state.reimburse,
      miles: this.state.miles,
      medical: this.state.medical,
      dental: this.state.dental,
      vision: this.state.vision,
      k401: this.state.k401
    })
    .then(
      response => {
        window.alert('Saved');
      },
      error => {
        window.alert(error.response.data);
      }
    )
  }

  //trys to turn a string into a double, returns 0.0 if it fails
  TryParseDouble(str){
    var ret = 0.0;

    if(str !== null && str.length > 0 && !isNaN(str))
      ret = parseFloat(str);

    return ret;
  }

  //makes sure number doesnt go over two decimals
  maxTwoDecimals(str){
    if(Math.round(this.TryParseDouble(str) * 100) - this.TryParseDouble(str)*100 != 0)
      return false;

    return true;
  }

  //determine what text input field to change
  //performs multiple checks on each input before changing them to ensure
  //that they dont go outside the expected bounds for that field
  onChange(e){
    if(e.target.name === "salary"){
      if(this.TryParseDouble(e.target.value) >= 0 && this.maxTwoDecimals(e.target.value) && e.target.value.length > 0){
        this.setState({
          salary: e.target.value
        });
      }
    }
    else if(e.target.name === "hours"){
      if(this.TryParseDouble(e.target.value) >= 0 && this.TryParseDouble(e.target.value) <= 80 && !e.target.value.includes('.') && e.target.value.length > 0){
        this.setState({
          hours: e.target.value
        });
      }
    }
    else if(e.target.name === "bonus"){
      if(this.TryParseDouble(e.target.value) >= 0 && this.maxTwoDecimals(e.target.value) && e.target.value.length > 0){
        this.setState({
          bonus: e.target.value
        });
      }
    }
    else if(e.target.name === "reimburse"){
      if(this.TryParseDouble(e.target.value) >= 0 && this.maxTwoDecimals(e.target.value) && e.target.value.length > 0){
        this.setState({
          reimburse: e.target.value
        });
      }
    }
    else if(e.target.name === "miles"){
      if(this.TryParseDouble(e.target.value) >= 0 && !e.target.value.includes('.') && e.target.value.length > 0){
        this.setState({
          miles: e.target.value
        });
      }
    }
    else if(e.target.name === "medical"){
      if(this.TryParseDouble(e.target.value) >= 0 && this.maxTwoDecimals(e.target.value) && e.target.value.length > 0){
        this.setState({
          medical: e.target.value
        });
      }
    }
    else if(e.target.name === "dental"){
      if(this.TryParseDouble(e.target.value) >= 0 && this.maxTwoDecimals(e.target.value) && e.target.value.length > 0){
        this.setState({
          dental: e.target.value
        });
      }
    }
    else if(e.target.name === "vision"){
      if(this.TryParseDouble(e.target.value) >= 0 && this.maxTwoDecimals(e.target.value) && e.target.value.length > 0){
        this.setState({
          vision: e.target.value
        });
      }
    }
    else if(e.target.name === "k401"){
      if(this.TryParseDouble(e.target.value) >= 0 && this.TryParseDouble(e.target.value) <= 100 && this.maxTwoDecimals(e.target.value) && e.target.value.length > 0){
        this.setState({
          k401: e.target.value
        });
      }
    }
  }

  //calculate everything that can be calculated with the given information
  calculate(){
    var values = {
      grossHourly: 0, //hourly rate times hours worked
      totalPretaxDeductions: 0, //medical,dental,vision
      mileage: 0,  //if the employee drives they get mileage reimbursement
      retirement: 0,  //401k after deductions and ssTax
      fedTax: 0,
      ssTax: 0, //medicare + ss calculate before 401k
      taxableIncome: 0, //how much to tax for ss + medicare + fed taxes
      netIncome: 0
    }

    values.grossHourly = this.TryParseDouble((this.state.salary/26/80 * this.state.hours).toFixed(2));
    //pretax deductions before 401k for ss and medicare tax
    values.totalPretaxDeductions = this.TryParseDouble(this.state.medical) + this.TryParseDouble(this.state.dental) + this.TryParseDouble(this.state.vision);

    //calculate taxable income from grossHourly + bonus minus Deductions
    values.taxableIncome = values.grossHourly + this.TryParseDouble(this.state.bonus) - values.totalPretaxDeductions;
    //calculate ssTax from taxableIncome
    values.ssTax = this.TryParseDouble((0.0765*values.taxableIncome).toFixed(2));

    //calculate 401k then recalculate taxableIncome minus 401k for Federal taxes
    values.retirement = this.TryParseDouble((this.TryParseDouble(this.state.k401)/100 * (values.grossHourly - values.totalPretaxDeductions - values.ssTax)).toFixed(2));
    values.taxableIncome -= values.retirement + values.ssTax

    //federal income tax (flat tax because I dont know how to calculate this from a paycheck)
    values.fedTax = this.TryParseDouble((values.taxableIncome * .1).toFixed(2));

    //various other calculattions
    values.mileage = this.TryParseDouble((this.TryParseDouble(this.state.miles) * .55).toFixed(2));  //.55 cent average per mile reimbursement

    //netIncome total earnings minus deductions minus taxes
    values.netIncome += values.grossHourly + values.mileage + this.TryParseDouble(this.state.bonus) + this.TryParseDouble(this.state.reimburse);
    values.netIncome -= (values.totalPretaxDeductions + values.retirement);
    values.netIncome -= (values.ssTax + values.fedTax);
    values.netIncome = values.netIncome.toFixed(2);

    return values;
  }

  render() {
    //calculate necessary values before rendering
    //these include taxes, 401k, and rounding all calculated values
    var values = this.calculate();

    if(this.state.payInfo === false){
      return (
        <></>
      );
    }
    return (
      <div className="container">
        <div className="row my-4">
          <button type="button" className="btn btn-primary" onClick={this.updatePayrollInfo.bind(this)}>Save</button>
        </div>
        <div className="row justify-content-center">
          <div className="col">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th colSpan="3">Earnings</th>
                </tr>
                <tr>
                  <th>Pay Type</th>
                  <th>Amount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Salary</td>
                  <td><input type="number" name="salary" value={this.state.salary} onChange={this.onChange.bind(this)}></input></td>
                  <td>{(this.state.salary)}</td>
                </tr>
                <tr>
                  <td>Regular Hours</td>
                  <td><input type="number" name="hours" value={this.state.hours} onChange={this.onChange.bind(this)}></input></td>
                  <td>{values.grossHourly}</td>
                </tr>
                <tr>
                  <td>Bonus</td>
                  <td><input type="number" name="bonus" value={this.state.bonus} onChange={this.onChange.bind(this)}></input></td>
                  <td>{this.state.bonus}</td>
                </tr>
                <tr>
                  <td>Reimbursements</td>
                  <td><input type="number" name="reimburse" value={this.state.reimburse} onChange={this.onChange.bind(this)}></input></td>
                  <td>{this.state.reimburse}</td>
                </tr>
                <tr>
                  <td>Mileage</td>
                  <td><input type="number" name="miles" value={this.state.miles} onChange={this.onChange.bind(this)}></input></td>
                  <td>{values.mileage}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-center">Deductions</td>-
                </tr>
                <tr>
                  <td>Medical</td>
                  <td><input type="number" name="medical" value={this.state.medical} onChange={this.onChange.bind(this)}></input></td>
                  <td>{this.state.medical}</td>
                </tr>
                <tr>
                  <td>Dental</td>
                  <td><input type="number" name="dental" value={this.state.dental} onChange={this.onChange.bind(this)}></input></td>
                  <td>{this.state.dental}</td>
                </tr>
                <tr>
                  <td>Vision</td>
                  <td><input type="number" name="vision" value={this.state.vision} onChange={this.onChange.bind(this)}></input></td>
                  <td>{this.state.vision}</td>
                </tr>
                <tr>
                  <td>401K % Contribution</td>
                  <td><input type="number" name="k401" value={this.state.k401} onChange={this.onChange.bind(this)}></input></td>
                  <td>{values.retirement}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-center">Taxes</td>-
                </tr>
                <tr>
                  <td colSpan="2">Federal Income Tax</td>
                  <td>{values.fedTax}</td>
                </tr>
                <tr>
                  <td colSpan="2">Social Security + Medicare Tax</td>
                  <td>{values.ssTax}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-center">Pay Summary</td>
                </tr>
                <tr>
                  <td colSpan="2">Pay Period Net Income</td>
                  <td>{values.netIncome}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

if(window.document.getElementById("payroll"))
  ReactDOM.render(<Payroll/>, window.document.getElementById("payroll"));
