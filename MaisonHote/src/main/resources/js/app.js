var app = {
		// Classes
		Collections: {},
		Models: {},
		Views: {},
		// Instances
		collections: {},
		models: {},
		views: {},
		init: function () {
			// Initialisation de l'application ici
			//this.views.calendar = new this.Views.calendar();
			this.router = app.Router;
		}
};

$(document).ready(function () {
	// On lance l'application une fois que notre HTML est chargé
	app.init();
}) ;