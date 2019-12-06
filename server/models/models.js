var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  //hashed pw
  hash: {
    type: String,
    required: true
  }
});

var employeeSchema = new Schema({
  first: {
    type: String,
    required: true
  },
  last: {
    type: String,
    required: true
  },
  //username of the company who employs them
  employer: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
});

var payrollSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'employees',
    required: true,
    unique: true
  },
  salary: {
    type: Number,
    required: true
  },
  hours: {
    type: Number
  },
  bonus: {
    type: Number
  },
  reimburse: {
    type: Number
  },
  miles: {
    type: Number
  },
  medical: {
    type: Number
  },
  dental: {
    type: Number
  },
  vision: {
    type: Number
  },
  k401: {
    type: Number
  }
});

//make models from the schemas
var users = mongoose.model('users', userSchema);
var employees = mongoose.model('employees', employeeSchema);
var payroll = mongoose.model('payroll', payrollSchema);

//Export the model to make it avaiable to other parts of the Node application
module.exports = {
  users: users,
  employees: employees,
  payroll: payroll
}
