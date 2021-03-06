var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'featured', 'detail', 'zoom']
    },
    url: { type: String, required: true }
});

var Video = new Schema({
    kind: {
        type: String,
        enum: ['how to', 'article']
    },
    url: { type: String, required: true }
});

var Nutrition = new Schema({
    value: { type: String },
    unit: { type: String },
    nutrition: { type: String }
});
var Ingredient = new Schema({
    value: { type: String },
    unit: { type: String },
    ingredient: { type: String }
});

var BorrowedRecipe = new mongoose.Schema({
	originalRecipe: [Recipe],
	addedIngredients: [Ingredient],
	removedIngredients: [Ingredient],
	additionalInstructions: {type:String}
});

var Recipe = new Schema({
	user_id : { type: String},
	fn: { type: String, required: true },
	ingredients: [Ingredient],
	secretIngredients: [Ingredient], 
    instructions: { type: String },
	additionalInstructions: {type:String},
    yield: {type: String},
    duration: {type:String},
    images: [Image],
    video: [Video],
    summary: {type:String},
    author: [User],
	username:{type:String},
    published: {type:String},
    nutrition: [Nutrition],
    tag:{type:String},
	rating:{type:Number,validate: [/[0-9]/]},
	updated_at: Date
});
var User = new Schema({
	user_id : String,
	username: String,
	password: String, 
	friends:[User],
	images: [Image]
});
User.methods.validPassword = function (password) {
  if (password === this.password) {
    return true; 
  } else {
    return false;
  }
}

mongoose.model("Image", Image);
mongoose.model("Ingredient", Ingredient);
mongoose.model("Recipe", Recipe);
mongoose.model("User", User);
mongoose.connect('mongodb://nodejitsu:364b75cdf88539293972edf3b5b9feaa@dharma.mongohq.com:10042/nodejitsudb6237205951');
//mongoose.connect('mongodb://localhost/recipeFinder');