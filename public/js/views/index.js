define(['SocialNetView', 'text!templates/index.html',
        'views/status', 'models/Status'],
function(SocialNetView, indexTemplate, StatusView, Status) {
  var indexView = SocialNetView.extend({
    el: $('#content'),

    events: {
      "submit form": "updateStatus"
    },

    initialize: function() {
      this.collection.on('add', this.onStatusAdded, this);
      this.collection.on('reset', this.onStatusCollectionReset, this);
    },

    onStatusCollectionReset: function(collection) {
      var that = this;
	  console.log("onStatusCollectionReset: "+JSON.stringify(collection));
      collection.each(function (model) {
        that.onStatusAdded(model);
      });
    },

    onStatusAdded: function(status) {
	console.log("onStatusAdded: "+JSON.stringify(status));
      var statusHtml = (new StatusView({ model: status })).render().el;
      $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
    },

    updateStatus: function() {
      var statusText = $('input[name=status]').val();
	  var rName = $('input[name=fn]').val();
	  var rInstructions = $('input[name=instructions]').val();
	  var rYield = $('input[name=yield]').val();
	  var rDuration = $('input[name=duration]').val();
	  var rPhoto = $('input[name=photo]').val();
	  var rVideo = $('input[name=video]').val();
	  var rSummary = $('input[name=summary]').val();
	  var rPublished = $('input[name=published]').val();
      var statusCollection = this.collection;
      $.post('/accounts/me/status', {
        status: statusText, fn:rName,
		instructions: rInstructions,
		yield: rYield,
		duration: rDuration,
		photo: rPhoto,
		video: rVideo,
		summary: rSummary,
		published: rPublished,
		tag:"numerous|tags"
      }, function(data) {
        statusCollection.add(new Status({status:statusText,fn: rName,
		instructions: rInstructions,
		yield: rYield,
		duration: rDuration,
		photo: rPhoto,
		video: rVideo,
		summary: rSummary,
		published: rPublished, 
		tag:"numerous|tags"}));
      });
      return false;
    },

    render: function() {
      this.$el.html(indexTemplate);
    }
  });

  return indexView;
});
