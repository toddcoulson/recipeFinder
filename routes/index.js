
/*
 * GET home page.
 */
var mongoose=require('mongoose');
var Recipe = mongoose.model('Recipe');
var Image = mongoose.model('Image');
var Ingredient = mongoose.model('Ingredient');
var utils    = require( 'connect' ).utils;
var fs = require('fs');
var util = require('util');
var im = require('imagemagick');
//var jquery = require('jquery');

exports.index = function(req, res, next){
	Recipe.find().
	sort('-updated_at').
	exec(function(err, recipes, count){
		if( err ) return next( err );
		res.render('index', { title: 'Recipe Finder Index', recipes:recipes });
	})
  
};
exports.createRecipe = function(req, res){
	res.render('createRecipe', {
		title: 'Create New Recipe',
	});
}

exports.create = function(req, res){
	
	var combinePath = __dirname + '/../public/images/' + req.files.recipeImage.filename;
	ins = fs.createReadStream(req.files.recipeImage.path);
      ous = fs.createWriteStream(combinePath);
      util.pump(ins, ous, function(err) {
        if(err) {
		console.log(err);
		console.log("combinePath:"+combinePath);
          res.redirect('/createRecipe');
        } else {
			var r = new Recipe({fn: req.body.fn, images: [new Image({url:"/images/"+req.files.recipeImage.filename})], updated_at: Date.now()});
			if(req.body.instructions != "") r.instructions = req.body.instructions;
			if(req.body.yield != "") r.yield = req.body.yield;
			console.log(req.body);
			r.ingredients = [];
			for(var i = 0; i<req.body.value.length; i++){
				var ing = new Ingredient({value: req.body.value[i], unit: req.body.unit[i], ingredient: req.body.ingredient[i]});
				r.ingredients.push(ing);
			}
			
			if(req.body.duration != "") r.duration = req.body.duration;
			if(req.body.summary != "") r.summary = req.body.summary;
			if(req.body.published != "") r.published = req.body.published;
			if(req.body.tag != "") r.tag = req.body.tag;
			if(req.body.rating != "") r.rating = req.body.rating;
			r.save(function(err, recipe, count){
			var beginName = req.files.recipeImage.filename.replace(/\.[^/.]+$/, "");
			//console.log('../public/images/'+req.files.recipeImage.filename);
			//console.log('../public/images/'+beginName+"-small.jpg");
			/*im.resize({
			  srcPath: req.files.recipeImage.filename,
			  dstPath: beginName+"-small.jpg",
			  width:   256
			}, function(err, stdout, stderr){
			  if (err) throw err;
			  console.log('resized kittens.jpg to fit within 256x256px');
			});	*/
			
				res.redirect('/');
			});
        }
    });
};

exports.destroy = function (req, res){
	Recipe.findById(req.params.id, function(err, recipe){
		
 
		recipe.remove(function(err, recipe){
			if( err ) return next( err );
			res.redirect('/');
		});
	});
};

exports.edit = function (req, res){
	Recipe.
		findById(req.params.id, function(err, recipe){
			if( err ) return next( err );
			res.render('edit', {
				title: 'Recipe Finder Example',
				recipe: recipe,
				current: req.params.id
			});
		});
};

exports.update = function( req, res, next ){
  Recipe.findById( req.params.id, function ( err, recipe ){
    
    recipe.fn    = req.body.content;
    recipe.updated_at = Date.now();
    recipe.save( function ( err, recipe, count ){
      if( err ) return next( err );
 
      res.redirect( '/' );
    });
  });
};

exports.view = function( req, res, next ){
  Recipe.findById( req.params.id, function ( err, recipe ){
    res.render('view', {
		title: 'Display Full Recipe',
		recipe: recipe,
		current: req.params.id
	});
  });
};
 
// ** express turns the cookie key to lowercase **
exports.current_user = function ( req, res, next ){
  if( !req.cookies.user_id ){
    res.cookie( 'user_id', utils.uid( 32 ));
  }
 
  next();
};