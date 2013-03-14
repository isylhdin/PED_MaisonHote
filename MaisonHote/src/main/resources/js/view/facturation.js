window.FacturationView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

    	this.template = _.template(tpl.get('FacturationView'));
    	$(this.el).html(this.template(this.model));
		
        return this;
        
        
        window.nbFacture = 0;
        window.facture = new Facture();
		window.facture.localStorage = new Backbone.LocalStorage("factures-backbone");
        $(this.el).html(_.template(tpl.get('FacturationView')));
        return this;
    },
    
    saveDataFacture: function(){
		console.log("clic enregister!");
		success = true;
		window.nbFacturesSauveesDansCache = 0;

		//enregistre toutes les clients dans le cache
		facture.each(function(Facture){
			console.log($('#inputName').val());

			Facture.save({
			
			},
			{
				success: function(model, response, options) {
					nbFacturesSauveesDansCache++;
				},
				//pour que la fonction reRenderChambre ne soit pas appelée
				// à cause de la modif (les clients sont bindées)
				silent: true
			});
		});
		
		if(!success) {
			return;
		}
		
		$('#waitingResult').css('visibility','visible');
		$('#waitingResult').show();

		//update le fichier sur le serveur
		var obj = JSON.parse(localStorage.getItem("fichier-backbone-facture.json"));
		updateFile(obj.idFichier, JSON.stringify(facture.toJSON()), function(reponse) {	
			$('#waitingResult').fadeOut('fast');
			//Vérifie que tout s'est bien passé et affiche un message en conséquence
			if (!reponse.error && nbFacturesSauveesDansCache === nbFacture) {
				$('#goodResult').css('visibility','visible');
				$('#goodResult').show();
				$('#goodResult').fadeOut(3000, function() {
					$('#goodResult').css('visibility','hidden');
				});
			} else {
				console.log("ERROR § " + nbFacturesSauveesDansCache +
							" Factures sur " + nbFacture +
							" ont été sauvegardées dans le cache");
				$('#badResult').css('visibility','visible');
				$('#badResult').show();
				$('#badResult').fadeOut(15000, function() {
					$('#badResult').css('visibility','hidden');
				});
			}
		});
	},
	
	createFileFacture: function(){
		createNewFile('facture.json', function(reponse){
			window.idFacture = reponse.id;

			console.log("dans createNewFile");
			//on conserve l'id du fichier dans le cache pour pouvoir utiliser le web service d'update dessus (a besoin de son id)
			var fileFacture = new FichierConfig({'id':reponse.title, 'idFichier': idFacture });
			fileFacture.save();

			updateFile(reponse.id,  JSON.stringify(facture.toJSON()),function(reponse){	
				console.log(reponse);
			});

		});
	}
});
