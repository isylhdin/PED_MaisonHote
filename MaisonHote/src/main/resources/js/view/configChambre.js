window.EditChambreView = Backbone.View.extend({

	events : {
		"click .btn-danger"   : "onDelete",
		"click a.btn-primary" : "onAccept",
		"click .btn-success"  : "onAdd",
		"click #submit" 	  : "onSubmit"


	},

	initialize: function () {
		this.render();
	},

	footpage : function(){
		$(this.el).append("<div class='row' id='add'> <button class='btn btn-success'><i class='icon-plus icon-white'></i> Ajouter</button></div>");
		$(this.el).append("<div class='row'><button type='submit' id='submit' class='btn'>Enregistrer</button></div>");
		$(this.el).append("<div id='waitingResult' style='visibility:hidden' class='alert alert-info'>Sauvregarde en cours ... </div>");
		$(this.el).append("<div id='goodResult' style='visibility:hidden' class='alert alert-success'>Vos données ont été sauvegardées avec succès ! </div>");
		$(this.el).append("<div id='badResult'  style='visibility:hidden' class='alert alert-error'>Une erreur est survenue lors de la sauvegarde. Veuillez vérifier que vous êtes connecté à Internet et que vous utilisez un navigateur récent puis réésayez</div>");
	},

	render: function (){
		window.nbChambres = 0;
		window.nbChambresInitial = 0;
		window.nbChambresSauveesDansCache = 0;
		window.id;
		$(this.el).append("<div id='chambre'></div>");

		var self = this;

		window.chambres = new Chambres();
		window.chambres.localStorage = new Backbone.LocalStorage("chambres-backbone");
		window.chambres.fetch({
			success: function(model, response, options) {
				chambres.each(function(Chambre){
					this.template = _.template(tpl.get('ChambreView'));
					$(self.el).append(this.template(Chambre.toJSON()));
					nbChambres++;
					nbChambresInitial++;
				});
			}
		});

		this.footpage();
		console.log(chambres.toJSON());
		return this;
	},

	onDelete: function(event){
		console.log("clic delete !");

		event.preventDefault();
		window.id = $(event.currentTarget).data('id');

		this.modal(window.id);
	},

	onAccept: function(event){
		console.log("clic accept !");
		nbChambres--;

		//supprime la chambre de la collection
		var chambre =  window.chambres.get(window.id);
		chambres.remove(chambre);

		//supprime la chambre de la vue
		$('#row'+window.id).fadeOut(1000, function() {
			$('#row'+window.id).remove();	
		});	
		$("#modal").remove();

		//on rend accessible le bouton "add" s'il était grisé
		if($('.btn-success').attr('disabled')=='disabled'){
			$('.btn-success').removeAttr("disabled");
		}		
	},

	onAdd: function(event){
		console.log("clic add !");
		nbChambres++;

		var chambre = new Chambre({'id': window.nbChambres});
		chambres.add(chambre);

		this.template = _.template(tpl.get('ChambreView'));
		$('#add').before(this.template(chambre.toJSON()));

		//on ne peut avoir que 5 chambres max
		if(nbChambres == 5){
			$('.btn-success').attr("disabled", true);
		}
	},

	onSubmit: function(event){
		console.log("clic submit!");

		$('#waitingResult').css('visibility','visible');

		//supprime les données précédentes des maisons dans le cache pour qu'il n'y ait pas des valeurs 
		//supprimées qui restent malgrés tout 
		localStorage.removeItem("chambres-backbone");
		for(var i=1;i<=window.nbChambresInitial;i++){
			localStorage.removeItem("chambres-backbone-"+i);
		}

		//enregistre toutes les chambres dans le cache
		chambres.each(function(Chambre){
			window.price = $('#inputPrice'+Chambre.id).val();
			window.nbLit = $('#inputNbPerson'+Chambre.id).val();
			window.superficie = $('#inputArea'+Chambre.id).val();

			Chambre.save({'prixParJour':price, 'nbLit':nbLit, 'superficie':superficie}, {
				success: function(model, response, options) {
					nbChambresSauveesDansCache++;
				}
			});
			console.log(Chambre);
		});

		//update le fichier sur le serveur
		var obj = JSON.parse(localStorage.getItem("fichier-backbone-0"));
		tpl.updateFile(obj.idFichier, chambres.toJSON(),function(reponse){	
			$('#waitingResult').fadeOut('fast');
			//Vérifie que tout s'est bien passé et affiche un message en conséquence
			if (!reponse.error && nbChambresSauveesDansCache == nbChambres) {
				$('#goodResult').css('visibility','visible');
				$('#goodResult').fadeOut(3000, function() {
					$('#goodResult').css('visibility','hidden');
				});	
			}else{
				console.log("ERROR §");
				$('#badResult').css('visibility','visible');
				$('#badResult').fadeOut(15000, function() {
					$('#badResult').css('visibility','hidden');
				});	
			}
		});


	},

	modal : function(id){
		$('#row'+id).append(_.template(tpl.get('ModalView')));
		$('h3').text("Suppression");
		$('h4').text("Vous êtes sur le point de supprimer la chambre "+id);
		$("#modal").modal({
			backdrop: false  
		}); 		
	}


});