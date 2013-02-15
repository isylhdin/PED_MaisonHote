//The router is a Singleton.
//It is responsible of displaying your page given an URL.
app.Router = Backbone.Router.extend({

	routes: {
		"":	 "home" //index.html
	},


	initialize: function () {
//		this.createAppView();
//		this.renderAppView();
		//console.log("Welcome back home!");
		app.views.calendar = new app.Views.calendar();
		$('body').append(app.views.calendar.render().el);
	}
//	,

//	createAppView: function(){
//	// On instancie la vue principale
//	app.views.calendar = new app.Views.calendar();
//	},

//	// insert into the DOM, views that need to be rendered in the whole application.
//	renderAppView: function(){
//	$('body').append(app.view.calendar.render().el);
//	},

//	// cette route sera appelée à chaque fois qu'une route est inexistante ainsi qu'au lancement de l'application
//	home: function () {
//	console.log("Welcome back home!");
//	}
//	,


//	// cette route est appelé à chaque fois qu'une route existante est appelée
//	displayPage: function (route) {
//	// On cherche dans la collection si la route existe dans une de nos pages

//	// Si la page existe, on appelle la fonction de notre vue afin de l'afficher 

//	// Sinon on appelle la route "root" afin d'afficher la page de base
//	else if () {
//	this.root();
//	}
//	},

//	// cette fonction est appelé quand on clic sur un onglet du menu afin de changer sa classe
//	selectMenu: function (route) {
//	$('a.linkTab').removeClass('active');
//	$('a.linkTab[href="#'+route+'"]').addClass('active');
//	}
});

$(function(){
	// Initialisation du router, c'est lui qui va instancier notre vue de départ
	app.router = new app.Router();
	// On précise à Backbone JS de commencer à écouter les changement de l'url afin d’appeler notre routeur
	Backbone.history.start();
});