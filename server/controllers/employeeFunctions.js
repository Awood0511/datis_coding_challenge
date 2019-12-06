var models = require('./../models/models.js');

//get a list of all employees connected to the current user
exports.getAllEmployees = function(req, res){
  models.employees.find({ employer: req.user.id }, function(err, employees){
    if(err){
      console.log(err);
      res.status(500).send('An error occurred.');
      return;
    }
    else if(!employees) {
      res.status(200).json([]);
      return;
    }
    else{
      res.status(200).json(employees);
      return;
    }
  });
}

//create a new employee connected to the current user
exports.createNewEmployee = function(req, res){
  var first = req.body.first,
      last = req.body.last;

  if(!first || !last){
    res.status(500).send('Incorrect inputs.');
    return;
  }

  //create new employee document
  var newEmployee = new models.employees({first: first, last: last, employer: req.user.id});

  //add new employee to database
  newEmployee.save(function(err, employee){
    if(err){
      console.log(err);
      res.status(500).send('An error occurred.');
      return;
    }

    //return added employee object to add it to the list on employees view
    res.json(employee);
    return;
  });
}

//get employee id from url and perform checks in employee and user
exports.checkEmployee_id = function(req, res, next, employee_id){
  req.employee_id = employee_id;  //save id to req

  //check that employee exists
  models.employees.findOne({_id: employee_id}, function(err, employee){
    if(err){
      console.log(err);
      res.status(500).send('Something went wrong.');
      return;
    }
    if(!employee){
      console.log('Attempted lookup on nonexistant employee.');
      res.status(500).send('Employee does not exist.');
      return;
    }
    if(req.user === null){
      console.log('Must be logged in to view employee info.');
      res.status(403).send('Must be logged in to view employee info.');
      return;
    }

    //employee exists, check if current user has access to this employee
    if(employee.employer != req.user.id){
      console.log('You do not have access to view employee info.');
      res.status(403).send('You do not have access to view employee info.');
      return;
    }

    //nothing goes wrong so continue
    next();
  });
}

exports.getPayrollInfo = function(req, res){
  var payrollDefault = {
    salary: 0.0,
    hours: 80,
    bonus: 0.0,
    reimburse: 0.0,
    miles: 0,
    medical: 0.0,
    dental: 0.0,
    vision: 0.0,
    k401: 0.0
  }

  models.payroll.findOne({employee: req.employee_id}, function(err, payInfo){
    if(err){
      console.log(err);
      res.status(500).send('Something went wrong.');
      return;
    }
    if(!payInfo){
      //pay info doesnt exits yet, send the default
      res.json(payrollDefault);
      return;
    }

    //payroll document exists, send it back to frontend
    res.json(payInfo);
    return;
  });
}

exports.updatePayrollInfo = function(req, res){
  //get data from req body
  var update = {
    salary: req.body.salary,
    hours: req.body.hours,
    bonus: req.body.bonus,
    reimburse: req.body.reimburse,
    miles: req.body.miles,
    medical: req.body.medical,
    dental: req.body.dental,
    vision: req.body.vision,
    k401: req.body.k401
  };

  //search for this document
  var filter = {
    employee: req.employee_id
  };
  var options = {
    new: true,
    upsert: true  //will make new doc if none found
  };

  //save it to the database or update if exists
  models.payroll.findOneAndUpdate(filter, update, options, function(err){
    if(err){
      console.log(err);
      res.status(500).send('An error occured.');
      return;
    }

    res.status(200).send('Updated successfully.');
  });
}
