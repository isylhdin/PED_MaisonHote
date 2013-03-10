//It is responsible of displaying your page given an URL.
var appRouter = Backbone.Router.extend({

	routes: {
		"":	 				"home",  //index.html
		"resa":  			"resa",	 //index.html#resa
		"chambre":  		"editChambre", //index.html#chambre
		"prestation":  		"editPrestation", //index.html#prestation
		"ficheSejour":  	"ficheSejour" //index.html#ficheSejour
	},


	initialize: function() {
		console.log("Initialize router !");

		if (localStorage.length === 0) {
			this.connexion();
			$('#room').hide();
			$('#logOut').hide();
			$('#nameAppli').hide();
		} else {
			//Quand on actualise la page 
			//on récupère le nom du service de stockage qui est contenu dans le local storage
			if (currentHost == null) {
				currentHost =  jQuery.parseJSON(localStorage.getItem('currentHost-backbone-0')).host;
			}

			setToken();
			//A cet endroit il faudra set le token du service de stockage pour qu'il soit intégré aux appels de web services
			//ne marche pas, l'appel aux web service n'intègre pas le token dans le header ...

			this.headerView = new HeaderView();
			$('.header').html(this.headerView.el);
			this.resa();
		}



	},

	// Cette route sera appel�e � chaque fois qu'une route est inexistante
	// ainsi qu'au lancement de l'application
	home: function() {
		console.log("Welcome back home!");
	},

	connexion: function() {
		console.log("Welcome back connexion!");
		this.connexionView = new ConnexionView();
		$('#content').html(this.connexionView.el);
		this.headerView = new HeaderView();
		$('.header').html(this.headerView.el);
	},

	resa: function() {
		console.log("Welcome back resa!");
		chambresPourCalendrier = new Chambres(); 
		chambresPourCalendrier.fetch();

		this.calendarView = new CalendarView();
		$('#content').html(this.calendarView.template({rooms : chambresPourCalendrier}));
		

		//Reservations
		reservations = new Reservations();

		//Un calendrier poss�de un ensemble de r�servations
		calendar = new EventsView({el: $("#calendar"), collection: reservations}).render();
		reservations.fetch();
	},

	firstConfigChambre: function() {
		console.log("Welcome back firstConfig!");
		this.selectChambreView = new SelectChambreView({model: 	Chambre});
		$('#content').html(this.selectChambreView.el);

	},

	editChambre: function() {
		console.log("Welcome back config!");
		this.editChambreView = new EditChambreView();
		$('#content').html(this.editChambreView.el);

	},

	editPrestation: function() {
		console.log("Welcome back prestationConfig!");
		this.editPrestationView = new EditPrestationView();
		$('#content').html(this.editPrestationView.el);
	},

	ficheSejour: function() {
		console.log("Welcome back config!");
		this.ficheSejourView = new ficheSejourView();
		$('#content').html(this.ficheSejourView.el);
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
		},

		/** Retrieve and print a file's metadata. **/
		retrieveFile: function (fileName, callback) {

			var request = gapi.client.request({
				'path': '/drive/v2/files',
				'method': 'GET',
				'params': {
					q : "title='"+ fileName+ "'"
				}	        
			});	

			request.execute(function(resp) {
				callback(resp);
			});
		},


		/** Create a new file on the Drive **/
		createNewFile: function(fileName, callback) {
			gapi.client.load('drive', 'v2');

			var request = gapi.client.request({
				'path': '/drive/v2/files',
				'method': 'POST',
				'body': {
					"title" : fileName,
					"mimeType" : "application/json",
					"description" : "Config file of the guest house"	     	          
				}
			});

			request.execute(function(resp) { 
				console.log("File created : id = " + resp.id);
				//on conserve l'id du fichier dans le cache pour pouvoir utiliser le web service d'update dessus (a besoin de son id)
				var houseConfig = new FichierConfig({'idFichier': resp.id});
				houseConfig.save();
				callback(resp);
			});	     	   
		},


		/** Update an existing file knowing his 'fileId' **/
		updateFile: function(fileId, newContent, callback) {	    	   	    	
			//gapi.client.load('drive', 'v2');

			var request = gapi.client.request({
				'path': '/upload/drive/v2/files/' + fileId, 
				'method': 'PUT',
				'params': {'uploadType': 'media'},	    	        
				'body': newContent
			});

			request.execute(function(resp) {
				callback(resp);
			});	    	   
		},

		downloadFile : function (file, callback) {
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
		},

		saveContentFileIntoLocalStorage : function (fileContent) {
			var chambres = jQuery.parseJSON(fileContent);

			for(var i = 0; i < chambres.length; i++) {
				var chambre = new Chambre(chambres[i]);
				chambre.save();				
			}
		}
};



tpl.loadTemplates(['HeaderView', 'CalendarView', 'SelectChambreView',
		'ChambreView', 'ConnexionView', 'ficheSejourView','ServiceView',
		'ModalView'], function() {

	app = new appRouter();
	Backbone.history.start();
});
