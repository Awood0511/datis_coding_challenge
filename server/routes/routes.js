var express = require('express'),
    router = express.Router()
    //handlers
    userFunctions = require('./../controllers/userFunctions.js');
    employeeFunctions = require('./../controllers/employeeFunctions.js');

router.route('/signup')
  .post(userFunctions.createNewUser); //create a new user

router.route('/login')
  .get(userFunctions.getUserLoggedIn) //returns object of logged in user info
  .post(userFunctions.login)  //attempts to log in, sets cookie if successful
  .delete(userFunctions.logout);  //removes cookie if exists

router.route('/employees')
  .get(userFunctions.verifyUserLoggedIn, employeeFunctions.getAllEmployees) //get list of all employees umder current user
  .post(userFunctions.verifyUserLoggedIn, employeeFunctions.createNewEmployee); //create a new employee under current user

router.route('/employees/payroll/:employee_id')
  .get(employeeFunctions.getPayrollInfo)  //get saved payroll info for employee
  .post(employeeFunctions.updatePayrollInfo); //save payroll info for employee

router.param(':employee_id', employeeFunctions.checkEmployee_id); //makes sure employee exists and current user has access

module.exports = router;
