window.ConnexionView = Backbone.View.extend({

	events : {
		"click #google" : "buttonClickHandler"
	},

	initialize: function () {
		this.render();
	},

	render: function () {
		$(this.el).html(_.template(tpl.get('ConnexionView')));
		return this;
	},

	buttonClickHandler : function(event){
		
		//ancienne clé, compte florian (à utiliser au cas ou l'autre ne fonctionne pas (trouver pourquoi !?)
		// 966416489314.apps.googleusercontent.com
		//nouvelle clé, compte MyGuestHouse
		// 133252798458.apps.googleusercontent.com
		var config = {
				'client_id': '133252798458.apps.googleusercontent.com',
				'scope': 'https://www.googleapis.com/auth/drive'
		};
		
		gapi.auth.authorize(config, handleAuthResult);
	
		function handleAuthResult (authResult) {

			//si connexion réussie + token récupéré
			if (authResult && !authResult.error) {
				window.localStorage.clear();

				tpl.retrieveFile('house_config.json', function(reponse){
					if (reponse.items.length == 0) {
						alert("PREMIERE UTILISATION");
						app.firstConfigChambre();
					}else{
						alert("FICHIER de configuration présent sur google drive !");
						tpl.downloadFile(reponse.items[0] , tpl.saveContentFileIntoLocalStorage)
						
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
	}
});
