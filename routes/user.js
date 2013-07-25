var mongoose=require('mongoose');
var passport = require('passport');
var User = mongoose.model('User'), 
LocalStrategy = require('passport-local').Strategy;
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.register = function(req, res){
	new User({
		username: req.body.username,
		password: req.body.password
	}).save(function(err, user, count){
		res.redirect('/');
	})
};

exports.login = function(req, res, next){
		
		

};



// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function(username, password, done) {
	  console.log(username+" :username and password:"+password);
	  User.findOne( {username:username }, function ( err, user ){	
		 if (err) { 
			return done(err); 
		  }
		  if (!user) {
			return done(null, false, { message: 'Incorrect username.' });
		  }
		  if (!user.validPassword(password)) {
			return done(null, false, { message: 'Incorrect password.' });
		  }
		  gUsername = username;
		  return done(null, user);
	  });
	}
));
