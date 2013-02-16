//The router is a Singleton.
//It is responsible of displaying your page given an URL.
app.Router = Backbone.Router.extend({

	routes: {
		"":	 		"home", //index.html
		"resa":  	"resa"	//index.html#resa
	},


	initialize: function () {
		console.log("Initialize router !");
		app.views.calendar = new app.Views.calendar();
	},

	// cette route sera appelée à chaque fois qu'une route est inexistante ainsi qu'au lancement de l'application
	home: function () {
		console.log("Welcome back home!");
		$("#content").replaceWith("<div id='calendar'></div>");	
		app.calendar.render();
		app.events.fetch();
		
	},

	resa: function () {	
		$("#calendar").replaceWith("<div id='content'></div>");
		console.log("Welcome back resa!");
	}
});

//Important
$(function(){
	// Initialisation du router, c'est lui qui va instancier notre vue de départ
	app.router = new app.Router();
	// On précise à Backbone JS de commencer à écouter les changement de l'url afin d’appeler notre routeur
	Backbone.history.start();
});