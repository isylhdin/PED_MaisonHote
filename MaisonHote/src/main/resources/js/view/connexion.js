window.ConnexionView = Backbone.View.extend({

	events : {
		"click #google" : "buttonClickHandler"
	},

	initialize: function () {
		this.render();
	},

	render: function () {
		$(this.el).html(_.template(tpl.get('ConnexionView')));
		return this;
	},

	buttonClickHandler : function(event){

		var config = {
				'client_id': '966416489314.apps.googleusercontent.com',
				'scope': 'https://www.googleapis.com/auth/drive'
		};

		gapi.auth.authorize(config, function() {
			console.log('login complete');
			console.log(gapi.auth.getToken());
		});
	}


});