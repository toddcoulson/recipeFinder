
/**
 * Module dependencies.
 */

var express = require('express'),
    flash = require('connect-flash'),
    db = require('./db'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
  gUsername = "";

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir: __dirname + '/public/images',keepExtensions: true}));
  app.use(express.methodOverride());
  app.use(express.cookieParser()); 
  app.use(express.session({ secret: 'keyboard cat' }));
 // app.use( routes.current_user );
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions : true, showStack : true }));
});

app.configure( 'production', function (){
  app.use( express.errorHandler());
});

app.get('/index', ensureAuthenticated, routes.index);
app.get('/createRecipe', ensureAuthenticated, routes.createRecipe);
app.post('/create', ensureAuthenticated, routes.create);
app.get('/destroy/:id', ensureAuthenticated, routes.destroy);
app.get( '/edit/:id', ensureAuthenticated, routes.edit );
app.get( '/view/:id', ensureAuthenticated, routes.view );
app.post( '/update/:id', ensureAuthenticated, routes.update );
app.get( '/register', ensureAuthenticated, function(req, res){
	 res.render('register', { });
} );
app.post( '/register', ensureAuthenticated, user.register );

app.post('/ajax/:search', ensureAuthenticated, routes.search);
/*function (req, res){

   console.log(req.body);
   res.contentType('json');
   console.log(JSON.stringify({response:'json'}));
   res.write(JSON.stringify({response:'json'}));
   res.end();

 });*/

app.get('/', function(req, res){
  res.render('login', { user: req.user});
});

app.post('/login', passport.authenticate('local', { successRedirect: '/index', 
		failureRedirect: '/', 
		failureFlash: true }), 
		function(req, res) {
			res.redirect('/index');
		});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});




// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	var mongoose=require('mongoose');
  var User = mongoose.model('User');
   User.findById( id, function ( err, user ){
    done(err, user);
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}



