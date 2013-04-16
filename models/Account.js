module.exports = function(config, mongoose, nodemailer) {
  var crypto = require('crypto');

  
	var Nutrition = new mongoose.Schema({
    value: { type: String },
    unit: { type: String },
    nutrition: { type: String }
});
var Ingredient = new mongoose.Schema({
    value: { type: String },
    unit: { type: String },
    ingredient: { type: String }
});

var BorrowedRecipe = new mongoose.Schema({
	//originalRecipe: {type:Status},
	addedIngredients: [Ingredient],
	removedIngredients: [Ingredient],
	additionalInstructions: {type:String}
});

var Status = new mongoose.Schema({
    name: {
        first: { type: String },
        last: { type: String }
    },
	fn: { type: String },
    ingredients: [Ingredient],
	secretIngredients: [Ingredient], // special feature
    instructions: { type: String },
    yield: {type: String},
    duration: {type:String},
    photo: {type:String},
    video: {type:String},// special feature
    summary: {type:String},
    author: [Account],
    published: {type:String},
    nutrition: [Nutrition],
    tag:{type:String},
	rating:{type:Number}// special feature
});
var AccountSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String },
    name: {
        first: { type: String },
        last: { type: String }
    },
    photoUrl: { type: String },
    biography: { type: String },
    status: [Status], // My own recipes
    activity: [Status], //recipes from other sources
	friends: [Account]
});

  var Account = mongoose.model('Account', AccountSchema);

  var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    };
    return console.log('Account was created');
  };

  var changePassword = function(accountId, newpassword) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(newpassword);
    var hashedPassword = shaSum.digest('hex');
    Account.update({_id:accountId}, {$set: {password:hashedPassword}},{upsert:false},
      function changePasswordCallback(err) {
        console.log('Change password done for account ' + accountId);
    });
  };

  var forgotPassword = function(email, resetPasswordUrl, callback) {
    var user = Account.findOne({email: email}, function findAccount(err, doc){
      if (err) {
        // Email address is not a valid user
        callback(false);
      } else {
        var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
        resetPasswordUrl += '?account=' + doc._id;
        smtpTransport.sendMail({
          from: 'thisapp@example.com',
          to: doc.email,
          subject: 'SocialNet Password Request',
          text: 'Click here to reset your password: ' + resetPasswordUrl
        }, function forgotPasswordResult(err) {
          if (err) {
            callback(false);
          } else {
            callback(true);
          }
        });
      }
    });
  };

  var login = function(email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    Account.findOne({email:email,password:shaSum.digest('hex')},function(err,doc){
      callback(doc);
    });
  };

  var findById = function(accountId, callback) {
    Account.findOne({_id:accountId}, function(err,doc) {
      callback(doc);
    });
  }

  var register = function(email, password, firstName, lastName) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);

    console.log('Registering ' + email);
    var user = new Account({
      email: email,
      name: {
        first: firstName,
        last: lastName
      },
      password: shaSum.digest('hex')
    });
    user.save(registerCallback);
    console.log('Save command was sent');
  }

  return {
    findById: findById,
    register: register,
    forgotPassword: forgotPassword,
    changePassword: changePassword,
    login: login,
    Account: Account
  }
}
