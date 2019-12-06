var path = require('path'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    userFunctions = require('../controllers/userFunctions.js'),
    mongoose = require('mongoose'),
    router = require('../routes/routes.js');

module.exports.init = function() {
  //connect to mongodb
  try {
    mongoose.connect('mongodb://root:datispassword1@ds111913.mlab.com:11913/datis_challenge', {useNewUrlParser: true,
                                                                                               useUnifiedTopology: true});
    console.log('Connected to mongodb.');
  } catch (error) {
    console.log('Mongoose connection failed.');
    console.log(error);
  }

  //initialize app
  var app = express();

  //activate middleware
  app.use(express.static(path.resolve('./client')));  //serve static files
  app.use(morgan('dev')); //servide side logging
  app.use(cookieParser('COOKIE_SECRET'));  //parse cookie for persitant login
  app.use(userFunctions.getCurrentUser);  //middleware to get logged in user
  //parse request bodies
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  //send api requests to router
  app.use('/api', router);

  //serve htmls
  //home page
  app.get('/', function(req, res) {
    res.sendFile(path.resolve('./client/html/home.html'));
  });

  //signup page
  app.get('/signup', function(req, res) {
    res.sendFile(path.resolve('./client/html/signup.html'));
  });

  //add employee and view list of all employees
  app.get('/employees', function(req, res) {
    res.sendFile(path.resolve('./client/html/employees.html'));
  });

  //view, edit, and save payroll information for a single employee
  app.get('/employees/payroll/:employee_id', function(req, res) {
    res.sendFile(path.resolve('./client/html/payroll.html'));
  });

  //home page
  app.get('/favicon', function(req, res) {
    res.sendFile(path.resolve('./client/images/favicon.png'));
  });

  //404 any unmatched paths
  app.get('*', function(req, res){
      res.status(404).end();
  });

  return app;
};
