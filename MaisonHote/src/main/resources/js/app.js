//It is responsible of displaying your page given an URL.
var appRouter = Backbone.Router.extend({

	routes: {
		'' : 'home',  //index.html
		'resa' : 'resa',	 //index.html#resa
		'chambre' : 'editChambre', //index.html#chambre
		'prestation' : 'editPrestation', //index.html#prestation
		'ficheSejour/:id' : 'ficheSejour', //index.html#ficheSejour/id
		'listCustomer' : 'listCustomer', //index.html#listCustomer
		'facturation' : 'facturation' //index.html#facturation
	},

	initialize: function() {
		console.log('Initialize router!');

		if (localStorage.length === 0) {
			this.connexion();
			$('#room').hide();
			$('#logOut').hide();
			//$('#nameAppli').hide();
			document.getElementById('nameAppli').href = null;
			$('#service').hide();
			$('#listCustomer').hide();
		} else {
			// Quand on actualise la page on récupère le nom du service de
			// stockage qui est contenu dans le local storage
			if (currentHost == null) {
				currentHost = jQuery.parseJSON(
					localStorage.getItem('currentHost-backbone-0')).host;
			}

			setToken();

			// A cet endroit il faudra set le token du service de stockage
			// pour qu'il soit intégré aux appels de web services
			//ne marche pas, l'appel aux web service n'intègre pas le token
			// dans le header...

			this.headerView = new HeaderView();
			$('.header').html(this.headerView.el);
			this.resa();
		}
	},

	// Cette route sera appelée à chaque fois qu'une route est inexistante
	// ainsi qu'au lancement de l'application
	home: function() {
		console.log('Welcome back home!');
	},

	connexion: function() {
		console.log('Welcome back connexion!');
		controller.showView(new ConnexionView());
		this.headerView = new HeaderView();
		$('.header').html(this.headerView.el);
	},

	resa: function() {
		console.log('Welcome back resa!');

		chambresPourCalendrier = new Chambres();
		chambresPourCalendrier.localStorage =
			new Backbone.LocalStorage('chambres-backbone');

		prestasPourCalendrier = new Prestations();
		prestasPourCalendrier.localStorage =
			new Backbone.LocalStorage('prestations-backbone');

		resaGroupsPrestas = new ResaGroupsPrestas();
		resaGroupsPrestas.localStorage =
			new Backbone.LocalStorage('resa-groups-prestas');

		customersResa = new Customers();
		customersResa.localStorage =
			new Backbone.LocalStorage('customers-backbone');
		customersResa.fetch();

		this.calendarView = new CalendarView();
		controller.showView(this.calendarView);

		reservations = new Reservations();
		reservations.localStorage =
			new Backbone.LocalStorage('resas-backbone');

		//Un calendrier possède un ensemble de réservations
		this.calendarView.resasView = new ReservationsView({
			el: $('#calendar'), collection: reservations
		}).render();

		reservations.fetch();
	},

	firstConfigChambre: function() {
		console.log('Welcome back firstConfig!');
		controller.showView(new SelectChambreView({ model: Chambre }));
	},

	editChambre: function() {
		console.log('Welcome back config!');
		controller.showView(new EditChambreView());
	},

	editPrestation: function() {
		console.log('Welcome back prestationConfig!');
		controller.showView(new EditPrestationView());
	},

	listCustomer: function() {
		console.log('Welcome back config!');	
		controller.showView(new ListCustomerView());
	},

	ficheSejour: function(id, params) {
		console.log('Welcome back sejour!');
		var resa = jQuery.parseJSON(
			localStorage.getItem('resas-backbone-' + id));
		controller.showView(new ficheSejourView({ model: resa }));
	}
});

function AppController() {

	this.showView = function(view) {
		if (this.currentView) {
			if (this.currentView.close) {
        		this.currentView.close();
        	} else {
        		this.currentView.remove();
        	}
		}
		this.currentView = view;
		$('#content').html(this.currentView.el);
	}
}

tpl = {
		// Map of preloaded templates for the app
		templates: {},

		// Recursively pre-load all the templates for the app.
		// This implementation should be changed in a production environment.
		// A build script should concatenate
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
		},

		/* @bug : this function should be in host_drive.js but when it is
		 * called from host_drive.js it doesn't work, but it finely works
		 * when it is called from there.
		 */ 
		downloadFile: function (file, callback) {
			if (file.downloadUrl) {
				var accessToken = gapi.auth.getToken().access_token;
				var xhr = new XMLHttpRequest();
				xhr.open('GET', file.downloadUrl);
				xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
				xhr.onload = function() {
					callback(xhr.responseText);
				};
				xhr.onerror = function() {
					callback(null);
				};
				xhr.send(); 
			} else {
				callback(null);
			}
		}		
};

tpl.loadTemplates(['HeaderView', 'CalendarView', 'SelectChambreView',
		'ChambreView', 'ConnexionView', 'ficheSejourView', 'ServiceView',
		'DeleteModalView', 'FirstConfigModalView', 'ListCustomerView',
		'DataCustomerView', 'RoomForResaView', 'PrestaForResaView'],
		function() {

	controller = new AppController();
	app = new appRouter();
	Backbone.history.start();
});
