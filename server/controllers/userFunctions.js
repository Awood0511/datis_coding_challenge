var models = require('./../models/models.js')
    bcrypt = require('bcryptjs')
    jwt = require('jwt-simple');

//hardcoded test JWT secret not fit for production
const secret = 'TEST_SECRET';

exports.createNewUser = function(req, res) {
  //get variables from request body
  var username = req.body.username,
      password = req.body.password;

  var rounds = 10;  //hash rounds

  //hash the password
  bcrypt.hash(password, rounds, (err, hash) => {
	   if (err) {
       console.error(err)
       res.status(500).send("An error occured while processing the request.");
       return;
     }

     //create document from user model
     var newUser = new models.users({username: username, hash: hash});

     //try to add that document to the database
     newUser.save(function (err) {
       if (err) {
         console.log(err);
         res.status(500).send("An error occured while processing the request.");
         return;
       }

       //new account created
       res.send("Account created successfully.");
       return;
     });
  });
}

//checks if credentials match a current user
exports.login = function(req, res){
  //get variables from request body
  var username = req.body.username,
      password = req.body.password;

  //find user in database
  models.users.findOne({ username: username }, function(err, user){
    if(err){
      res.status(500).send('An error occurred');
      return;
    }
    else if(!user){
      res.status(403).send('Incorrect Username/Password');
      return;
    }

    //user found try and match password
    if(bcrypt.compareSync(password, user.hash)){
      //validation successful, make cookie with jwt
      var payload = {
        id: user._id,
        username: user.username,
        exp: (Math.round((new Date()).getTime() / 1000)) + 3600 //1 hr long jwt
      };
      token = jwt.encode(payload, secret);

      //return cookie
      res.cookie('DATIS_COOKIE', token, { maxAge: 3600 * 1000, httpOnly: true, signed: true })
        .send('Logged in.');
      return;
    }
    else{
      //validation fails
      res.status(403).send('Incorrect Username/Password');
      return;
    }
  });
}

//remove cookie that keeps user logged in
exports.logout = function(req, res){
  res.status(200).clearCookie('DATIS_COOKIE').send("Logged out.");
}

//middleware to set req.user with current logged in user info
exports.getCurrentUser = function(req, res, next){
  var token = req.signedCookies.DATIS_COOKIE; //get the cookie

  if (token === undefined){
    req.user = null;
    next();
  }
  else{
    //return the user info
    try{
      var decoded = jwt.decode(token, secret);
      //set user info for further requests
      req.user = {
          id: decoded.id,
          username: decoded.username
      };
      //decoded successfully
      next();
    }
    catch(err){
      console.log(err);
      req.user = null;
      next();
    }
  }
}

//reads req.user object from middleware and returns user info
exports.getUserLoggedIn = function(req, res){
  res.json(req.user);
}

//will deny access to a route when a user isnt found
exports.verifyUserLoggedIn = function(req, res, next){
  //deny access if not logeed in
  if(req.user === null){
    res.status(403).end();
    return;
  }

  next();
}
