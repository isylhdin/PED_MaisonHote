//It is responsible of displaying your page given an URL.
var appRouter = Backbone.Router.extend({

	routes: {
		"":	 				"home",  //index.html
		"resa":  			"resa",	 //index.html#resa
		"chambre":  		"editChambre", //index.html#chambre
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

		//Reservations
		events = new Events();
		//Un calendrier possède un ensemble de réservations
		calendar = new EventsView({el: $("#calendar"), collection: events}).render();
		events.fetch();
	},

	firstConfigChambre: function () {	
		console.log("Welcome back firstConfig!");
		this.selectChambreView = new SelectChambreView({model: 	Chambre});
		$('#content').html(this.selectChambreView.el);

	},

	editChambre: function () {	
		console.log("Welcome back config!");
		this.editChambreView = new EditChambreView();
		$('#content').html(this.editChambreView.el);

	},

	ficheSejour: function () {	
		console.log("Welcome back config!");
		this.ficheSejourView = new ficheSejourView();
		$('#content').html(this.ficheSejourView.el);
	},

	service: function () {	
		console.log("Welcome back config!");
		this.serviceView = new ServiceView();
		$('#content').html(this.serviceView.el);
	},

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


		/** Create a new file on the Drive **/
		createNewFile: function(fileName, callback) {
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

			request.execute(function(resp) { 
				console.log("File created : id = "+ resp.id); 
				callback(resp);
			});	     	   
		},


		/** Update an existing file knowing his 'fileId' **/
		updateFile: function(fileId, newContent, callback) {	    	   	    	
			//gapi.client.load('drive', 'v2');

			var request = gapi.client.request({
				'path': '/upload/drive/v2/files/'+ fileId, 
				'method': 'PUT',
				'params': {'uploadType': 'media'},	    	        
				'body': newContent});

			request.execute(function(resp){
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

		saveContentFileIntoLocalStorage : function (fileContent){
			var chambres = jQuery.parseJSON(fileContent);
			
			for(var i=0; i<chambres.length;i++){
				var chambre = new Chambre(chambres[i]);
				chambre.save();				
			}
		}
};



tpl.loadTemplates(['HeaderView', 'CalendarView', 'SelectChambreView', 'ChambreView', 'ConnexionView', 'ficheSejourView','ServiceView','ModalView'], function() {

	app = new appRouter();
	Backbone.history.start();
});