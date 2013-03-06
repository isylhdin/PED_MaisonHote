var currentHost;

window.ConnexionView = Backbone.View.extend({

	events : {
		"click #google" : "buttonGoogleHandler",
		"click #dropbox" : "buttonDropboxHandler"
	},

	initialize: function () {
		window.localStorage.clear();
		this.render();
	},

	render: function () {
		$(this.el).html(_.template(tpl.get('ConnexionView')));
		return this;
	},

	buttonGoogleHandler : function(event){
		currentHost = 'Drive' ;
		this.saveCurrentHost(currentHost);	
		connectToHost(handleAuthResultDrive);
		//connectToHost(handleAuthResult); ne fonctionne pas encore, probleme "Uncaught TypeError: Cannot convert object to primitive value"
	},
	
	buttonDropboxHandler : function (event){
		currentHost = 'Dropbox' ;
		this.saveCurrentHost(currentHost);
		connectToHost (handleAuthResultDropbox);
	},
	
	saveCurrentHost : function (currentHost){
		var host = new CurrentHost({'host' : currentHost});
		host.save();
	}
	
});
