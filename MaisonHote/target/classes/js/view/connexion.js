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

						//on charge le menu
						this.headerView = new HeaderView();
						$('.header').html(this.headerView.el);
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