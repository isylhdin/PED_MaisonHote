window.ConnexionView = Backbone.View.extend({

	events : {
		"click #google" : "buttonGoogleHandler",
		"click #dropbox" : "buttonDropboxHandler"
	},

	initialize: function () {
		this.render();
	},

	render: function () {
		$(this.el).html(_.template(tpl.get('ConnexionView')));
		return this;
	},

	buttonGoogleHandler : function(event){
		
		// old key, in case : 966416489314.apps.googleusercontent.com		
		// key to use : 133252798458.apps.googleusercontent.com
		var config = {
				'client_id': '133252798458.apps.googleusercontent.com',
				'scope': 'https://www.googleapis.com/auth/drive'
		};
		
		gapi.auth.authorize(config, handleAuthResult);
	
		function handleAuthResult (authResult) {

			//si connexion réussie + token récupéré
			if (authResult && !authResult.error) {
				window.localStorage.clear();

				tpl.retrieveFile('house_config2.json', function(reponse){
					if (reponse.items.length == 0) {
						alert("PREMIERE UTILISATION");
						app.firstConfigChambre();
					}else{
						alert("FICHIER de configuration présent sur google drive !");
						tpl.downloadFile(reponse.items[0] , tpl.saveContentFileIntoLocalStorage);
						
						var houseConfig = new FichierConfig({'idFichier': reponse.items[0].id});
						houseConfig.save();

						//on charge le menu
						// this.headerView = new HeaderView();
						// $('.header').html(this.headerView.el);
						$('#room').show();
						$('#logOut').show();
						$('#nameAppli').show();
						//et on redirige sur la page des réservations
						app.resa();
					}
				});
			} 
			else{
				console.log("Récupération de token : FAIL");
			}	
		}
	},
	
	buttonDropboxHandler : function (event){
		connectDropbox (handleAuthResultDropbox);
		
		function handleAuthResultDropbox (authResult) {
			findFileDropbox('house_config.json', function(reponse){
					if (!reponse){
						alert("PREMIERE UTILISATION");
						app.firstConfigChambre();	
					}
					else {
						alert("FICHIER de configuration présent sur Dropbox !");
						getFileContentDropbox('house_config.json', tpl.saveContentFileIntoLocalStorage);
						
						var houseConfig = new FichierConfig({'idFichier': 'house_config.json'});
						houseConfig.save();
						//on charge le menu
						// this.headerView = new HeaderView();
						// $('.header').html(this.headerView.el);
						$('#room').show();
						$('#logOut').show();
						$('#nameAppli').show();
						//et on redirige sur la page des réservations
						app.resa();
					}
			});
		}		
	}	
	
});
