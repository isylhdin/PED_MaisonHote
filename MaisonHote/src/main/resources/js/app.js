//It is responsible of displaying your page given an URL.
var appRouter = Backbone.Router.extend({

	routes: {
		"":	 				"home",  //index.html
		"resa":  			"resa",	 //index.html#resa
		"chambre":  		"chambre", //index.html#chambre
		"ficheSejour":  	"ficheSejour" //index.html#ficheSejour
	},


	initialize: function () {
		console.log("Initialize router !");
		this.connexion();
	},

	// cette route sera appelée à chaque fois qu'une route est inexistante ainsi qu'au lancement de l'application
	home: function () {
		console.log("Welcome back home!");
	},

	connexion: function () {
		console.log("Welcome back connexion!");
		this.connexionView = new ConnexionView();
		$('#content').html(this.connexionView.el);		
	},

	resa: function () {	
		console.log("Welcome back resa!");
		this.calendarView = new CalendarView();
		$('#content').html(this.calendarView.el);

		//---------------  Code qui charge mal le calendrier ----------------//
		//Reservations
		events = new Events();
		//Un calendrier possède un ensemble de réservations
		calendar = new EventsView({el: $("#calendar"), collection: events}).render();
		events.fetch();
	},

	chambre: function () {	
		console.log("Welcome back config!");
		this.selectChambreView = new SelectChambreView({model: 	Chambre});
		$('#content').html(this.selectChambreView.el);

	},

	ficheSejour: function () {	
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
		retrieveFile: function (/*fileId*/fileName, callback) {

//			console.log(fileId);
//			var request = gapi.client.request({
//			'path': '/drive/v2/files/'+fileId,
//			'method': 'GET'	      
//			});

			var request = gapi.client.request({
				'path': '/drive/v2/files',
				'method': 'GET',
				'params': {
					q : "title='"+fileName+"'"
				}	        
			});	


			request.execute(function(resp) {
				console.log('Title: ' + resp.title);
				console.log('Description: ' + resp.description);
				console.log('MIME type: ' + resp.mimeType);	
				callback(resp);
			});
		},

		listAllFiles :function (callback) {
			var retrievePageOfFiles = function(request, result) {
				request.execute(function(resp) {
					result = result.concat(resp.items);
					var nextPageToken = resp.nextPageToken;
					if (nextPageToken) {
						request = gapi.client.request({
							'path': '/drive/v2/files',
							'method': 'GET',
							'pageToken': nextPageToken
						});
						retrievePageOfFiles(request, result);
					} else {
						callback(result);
					}
				});
			}

			var initialRequest = gapi.client.request({
				'path': '/drive/v2/files',
				'method': 'GET'
			});
			retrievePageOfFiles(initialRequest, []);
		},

		createNewFile: function(fileName) {
			gapi.client.load('drive', 'v2');
			
			var request = gapi.client.request({
				'path': '/drive/v2/files',
				'method': 'POST',
				'body':{
					"title" : fileName,
					"mimeType" : "application/json",
					"description" : "Config file of the guest house"	     	          
				}
			});

			request.execute(function(resp) { console.log("File created : id = "+ resp.id); });	     	   
		}



		/** Download a file's content **/
//		downloadFile :function (file, callback) {
//		if (file.downloadUrl) {
//		var accessToken = gapi.auth.getToken().access_token;
//		console.log(accessToken);
//		var xhr = new XMLHttpRequest();
//		xhr.open('GET', file.downloadUrl);
//		xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
//		xhr.onload = function() {
//		callback(xhr.responseText);
//		};
//		xhr.onerror = function() {
//		callback(null);
//		};
//		xhr.send();
//		} else {
//		console.log("pas marché");
//		callback(null);
//		}
//		},



};



tpl.loadTemplates(['HeaderView', 'CalendarView', 'SelectChambreView', 'ChambreView', 'ConnexionView', 'ficheSejourView'], function() {

	app = new appRouter();
	Backbone.history.start();
});
