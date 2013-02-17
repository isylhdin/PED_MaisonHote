//It is responsible of displaying your page given an URL.
var appRouter = Backbone.Router.extend({

	routes: {
		"":	 			"home",  //index.html
		"resa":  		"resa",	 //index.html#resa
		"maison":  		"maison" //index.html#config
	},


	initialize: function () {
		console.log("Initialize router !");
		//Charge le menu
		this.headerView = new HeaderView();
		$('.header').html(this.headerView.el);
	},

	// cette route sera appelée à chaque fois qu'une route est inexistante ainsi qu'au lancement de l'application
	home: function () {
		console.log("Welcome back home!");
	},

	resa: function () {	
		console.log("Welcome back resa!");
		this.calendarView = new CalendarView();
		$('#content').html(this.calendarView.el);
		//Reservations
		events = new Events();
		//Un calendrier possède un ensemble de réservations
		calendar = new EventsView({el: $("#calendar"), collection: events}).render();
		events.fetch();
	},
	
	maison: function () {	
		console.log("Welcome back config!");
		this.configMaisonView = new ConfigMaisonView();
		$('#content').html(this.configMaisonView.el);
	}
	

});

tpl = {
		// Map of preloaded templates for the app
		templates: {},

		// Recursively pre-load all the templates for the app.
		// This implementation should be changed in a production environment. A build script should concatenate
		// all the template files in a single file.
		loadTemplates: function(names, callback) {

			var that = this;

			var loadTemplate = function(index) {
				var name = names[index];
				console.log('Loading template: ' + name);
				$.get('template/' + name + '.html', function(data) {
					that.templates[name] = data;
					index++;
					if (index < names.length) {
						loadTemplate(index);
					} else {
						callback();
					}
				}, 'text');
			}

			loadTemplate(0);
		},

		// Get template by name from map of preloaded templates
		get: function(name) {
			return this.templates[name];
		}

};


tpl.loadTemplates(['HeaderView', 'CalendarView', 'ConfigMaisonView'], function() {
	app = new appRouter();
	Backbone.history.start();
});
