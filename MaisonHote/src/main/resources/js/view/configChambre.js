window.EditChambreView = Backbone.View.extend({

	events : {
		"click .btn-danger"   : "onDelete",
		"click a.btn-primary" : "onAcceptDelete",
		"click .btn-success"  : "onAdd",
		"click #submit" 	  : "onSubmit",
		"focus input"	 : "onInputGetFocus",
	},

	initialize: function () {
		$(this.el).append("<header class='jumbotron subhead' id='overview'  style='height:330px;background: url(images/top-image.jpg) no-repeat; margin-top:-20px;'> <div class='container'><h1>Edition des Chambres</h1></div></header>");
		this.render();
	},

	/**
	 * Affiche toutes les chambres contenues dans le cache + le footpage
	 */
	render: function (){
		window.nbChambres = 0;
		window.nbChambresInitial = 0;
		window.id;
		window.template = this.template;

		$(this.el).append("<div id='chambre'></div>");

		var self = this;

		window.chambres = new Chambres();
		window.chambres.localStorage = new Backbone.LocalStorage("chambres-backbone");
		window.chambres.fetch({
			success: function(model, response, options) {
				chambres.each(function(Chambre){
					//Quand une chambre est modifiée on la réaffiche pour que la vue soit à jour
					Chambre.bind('change', self.reRenderChambre);
					Chambre.bind('invalid ', self.onError);
					this.template = _.template(tpl.get('ChambreView'));
					$(self.el).append(this.template(Chambre.toJSON()));
					nbChambres++;
					nbChambresInitial++;
				});
			}
		});

		this.footpage();						
		//met les id des chambres dans l'ordre, sinon ils sont en désordre pour les afficher dans les vues suivantes
		chambres.sortByField('id');

		return this;
	},

	/**
	 * Fonction appelée quand une chambre a été supprimée et qu'il y a avait des chambre derrière elle
	 * Les chambres qui la suivaient sont alors re-numérotées et la vue est mise à jour
	 */
	reRenderChambre : function(){
		var chambre = this;
		var addition = parseInt(chambre.id)+1;
		console.log($('#row'+addition));
		$('#row'+addition).html(window.template(chambre.toJSON()));
	},

	/**
	 * Affiche le bouton 'Add' pour ajouter dynamiquement une nouvelle chambre
	 * 
	 * Rajoute des 'Alerts' en fonction de différents évenements : 
	 * - Sauvegarde des informations (dans le cache + le serveur)
	 * - Sauvegarde qui a réussi
	 * - Sauvegarde qui a échoué
	 * 
	 * => Les 3 types d'alert sont "hidden" et s'afficheront le moment voulu lors de l'appel à la méthode 'onSubmit'
	 */
	footpage : function(){

		//si on a deja 5 chambres d'affichées, on disable le bouton add
		if(nbChambres == 5){
			$(this.el).append("<div class='row' id='add'> <button class='btn btn-success' disabled='disabled'><i class='icon-plus icon-white'></i> Ajouter</button></div>");
		}else{
			$(this.el).append("<div class='row' id='add'> <button class='btn btn-success' ><i class='icon-plus icon-white'></i> Ajouter</button></div>");
		}

		$(this.el).append("<div class='row'><button type='submit' id='submit' class='btn'>Enregistrer</button></div>");
		$(this.el).append("<div id='waitingResult' style='visibility:hidden' class='alert alert-info'>Sauvregarde en cours ... </div>");
		$(this.el).append("<div id='goodResult' style='visibility:hidden' class='alert alert-success'>Vos données ont été sauvegardées avec succès ! </div>");
		$(this.el).append("<div id='badResult'  style='visibility:hidden' class='alert alert-error'>Une erreur est survenue lors de la sauvegarde. Veuillez vérifier que vous êtes connecté à Internet et que vous utilisez un navigateur récent puis réésayez</div>");
	},

	/**
	 * Point d'entrée pour le suppression d'une chambre
	 * Recupère l'id de la chambre qu'on veut supprimer et afficher une pop-up pour confirmer la suppression
	 */
	onDelete: function(event){
		console.log("clic delete !");

		event.preventDefault();
		window.id = $(event.currentTarget).data('id');

		this.modal(window.id);
	},

	/**
	 * Sur l'acceptation de la suppression de la chambre via la pop-up on:
	 * - supprime la chambre de la collection
	 * - supprime la chambre de la vue
	 * - supprime la chambre du cache
	 */
	onAcceptDelete: function(event){
		console.log("clic accept !");

		//supprime la chambre de la collection
		var chambre =  window.chambres.get(window.id);
		chambres.remove(chambre);

		//supprime la chambre de la vue
		$('#row'+window.id).fadeOut(1000, function() {
			$('#row'+window.id).remove();	
		});	
		$("#modal").remove();

		//supprime toutes les chambres qui la suivent du cache
		this.deleteFromCache();

		nbChambres--;

		//on rend accessible le bouton "add" s'il était grisé
		if($('.btn-success').attr('disabled')=='disabled'){
			$('.btn-success').removeAttr("disabled");
		}		
	},

	/**
	 * Quand on ajoute une chambre, elle est ajoutée à la collection des chambres puis ajoutée à la vue
	 */
	onAdd: function(event){
		console.log("clic add !");
		nbChambres++;

		var chambre = new Chambre({'id': window.nbChambres});
		chambres.add(chambre);

		this.template = _.template(tpl.get('ChambreView'));
		$('#add').before(this.template(chambre.toJSON()));

		chambre.bind('change', this.reRenderChambre);
		chambre.bind('invalid ', this.onError);

		this.disableAddButton();
	},

	onSubmit: function(event){
		console.log("clic submit!");
		success = true;
		window.nbChambresSauveesDansCache = 0;

		//enregistre toutes les chambres dans le cache
		chambres.each(function(Chambre){
			window.price = $('#inputPrice'+Chambre.id).val();
			window.nbLit = $('#inputNbPerson'+Chambre.id).val();
			window.superficie = $('#inputArea'+Chambre.id).val();

			Chambre.save({'prixParJour':price, 'nbLit':nbLit, 'superficie':superficie}, {
				success: function(model, response, options) {
					nbChambresSauveesDansCache++;
				},
				silent: true //pour que la fonction reRenderChambre ne soit pas appelée à cause de la modif (les chambres sont bindées)
			});
		});
		
		if(!success){
			return;
		}
		
		$('#waitingResult').css('visibility','visible');
		$('#waitingResult').show();

		//update le fichier sur le serveur
		var obj = JSON.parse(localStorage.getItem("fichier-backbone-0"));
		tpl.updateFile(obj.idFichier, chambres.toJSON(),function(reponse){	
			$('#waitingResult').fadeOut('fast');
			//Vérifie que tout s'est bien passé et affiche un message en conséquence
			if (!reponse.error && nbChambresSauveesDansCache == nbChambres) {
				$('#goodResult').css('visibility','visible');
				$('#goodResult').show();
				$('#goodResult').fadeOut(3000, function() {
					$('#goodResult').css('visibility','hidden');
				});	
			}else{
				console.log("ERROR § "+ nbChambresSauveesDansCache +" chambres sur "+nbChambres+" ont été sauvegardées dans le cache");
				$('#badResult').css('visibility','visible');
				$('#badResult').show();
				$('#badResult').fadeOut(15000, function() {
					$('#badResult').css('visibility','hidden');
				});	
			}
		});
	},

	/**
	 * Contenu de la pop-up de suppression
	 */
	modal : function(id){
		$('#row'+id).append(_.template(tpl.get('ModalView')));
		$('h3').text("Suppression");
		$('h4').text("Vous êtes sur le point de supprimer la chambre "+id);
		$("#modal").modal({
			backdrop: false  
		}); 		
	},

	/**
	 * Supprime du cache les chambres suivant la chambre qui vient d'être supprimée pour avoir un cache cohérent avec l'UI
	 */
	deleteFromCache : function(){
		console.log("id de la chambre supprimée = "+id + " et nbChambre = "+nbChambres);
		if(id <= nbChambres){
			localStorage.removeItem("chambres-backbone-"+window.id);
			for(var i= window.id + 1; i<=nbChambres; i++){
				localStorage.removeItem("chambres-backbone-"+i);
				var chambre =  window.chambres.get(i);
				chambre.set({'id': i-1});
				console.log(chambre);
			}
		}
	},

	disableAddButton: function(){
		//on ne peut avoir que 5 chambres max
		if(nbChambres == 5){
			$('.btn-success').attr("disabled", true);
		}
	},
	
	onError: function( model, error) {
		 success = window.validateForm.onError(model, error, this);
	},

	onInputGetFocus: function( e ) {
		 window.validateForm.onInputGetFocus(e);
	}
});