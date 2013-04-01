var currentHost;

window.ConnexionView = Backbone.View.extend({

	events : {
		'click #google' : 'buttonGoogleHandler',
		'click #dropbox' : 'buttonDropboxHandler'
	},

	initialize: function () {
		window.localStorage.clear();
		this.render();
	},

	render: function () {
		$(this.el).html(_.template(tpl.get('ConnexionView')));
		return this;
	},
	
	saveCurrentHost : function (currentHost) {
		var host = new CurrentHost({ 'host' : currentHost });
		host.save();
	},

	buttonGoogleHandler : function(event) {
		currentHost = 'Drive';
		this.saveCurrentHost(currentHost);	
		connectToHost();		
	},
	
	buttonDropboxHandler : function (event) {
		currentHost = 'Dropbox';
		this.saveCurrentHost(currentHost);
		connectToHost();
	}
});
