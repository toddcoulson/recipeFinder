
/*
 * GET home page.
 */
var mongoose=require('mongoose');
var Recipe = mongoose.model('Recipe');
var utils    = require( 'connect' ).utils;

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
	
	var r = new Recipe({
		fn: req.body.fn,
		instructions: req.body.instructions,
		yield: req.body.yield,
		duration: req.body.duration,
		summary: req.body.summary,
		published: req.body.published,
		tag: req.body.tag,
		rating: req.body.rating,
		updated_at: Date.now()
	}).save(function(err, recipe, count){
		res.redirect('/');
	});
	console.log(r);
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
		find().
		sort('-updated_at').
		exec(function(err, recipes){
			if( err ) return next( err );
			res.render('edit', {
				title: 'Recipe Finder Example',
				recipes: recipes,
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