window.ConnexionView = Backbone.View.extend({

	events : {
		"click #google" : "buttonGoogleHandler",
		"click #dropbox" : "buttonDropboxHandler"
	},

	initialize: function () {
		this.render();
	},

	render: function () {
		$(this.el).html(_.template(tpl.get('ConnexionView')));
		return this;
	},

	buttonGoogleHandler : function(event){
		currentHost = 'Drive' ;
		connectToHost(handleAuthResultDrive);
		//connectToHost(handleAuthResult); ne fonctionne pas encore, probleme "Uncaught TypeError: Cannot convert object to primitive value"

	},
	
	buttonDropboxHandler : function (event){
		currentHost = 'Dropbox' ;
		connectToHost (handleAuthResult);
	}
	
});
