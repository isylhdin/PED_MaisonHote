window.EditChambreView = Backbone.View.extend({

	events : {
		"click .btn-danger"  : "onDelete",
		"click a.btn-primary" : "onAccept",
		"click .btn-success" : "onAdd",
		"click #submit" 	 : "onSubmit"


	},

	initialize: function () {
		this.render();
	},

	footpage : function(){
		$(this.el).append("<div class='row' id='add'> <a class='btn btn-success'><i class='icon-plus icon-white'></i> Ajouter</a></div>");
		$(this.el).append("<div class='row'><button type='submit' id='submit' class='btn'>Enregistrer</button></div>");
		$(this.el).append("<div id='waitingResult' style='visibility:hidden' class='alert alert-info'>Sauvregarde en cours ... </div>");
		$(this.el).append("<div id='goodResult' style='visibility:hidden' class='alert alert-success'>Vos données ont été sauvegardées avec succès ! </div>");
		$(this.el).append("<div id='badResult'  style='visibility:hidden' class='alert alert-error'>Une erreur est survenue lors de la sauvegarde. Veuillez réessayer</div>");
	},

	render: function (){
		window.nbChambres = 0;
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

		$('#row'+window.id).fadeOut(1000, function() {
			$('#row'+window.id).remove();	
		});	
		$("#modal").remove();
	},

	onAdd: function(event){
		console.log("clic add !");
		nbChambres++;

		var chambre = new Chambre({'id': window.nbChambres});
		chambres.add(chambre);

		this.template = _.template(tpl.get('ChambreView'));
		$('#add').before(this.template(chambre.toJSON()));	

	},

	onSubmit: function(event){
		console.log("clic submit!");

	//	$('#waitingResult').css('visibility','visible');
		
		chambres.each(function(Chambre){
			window.price = $('#inputPrice'+Chambre.id).val();
			window.nbLit = $('#inputNbPerson'+Chambre.id).val();
			window.superficie = $('#inputArea'+Chambre.id).val();

			Chambre.save({'prixParJour':price, 'nbLit':nbLit, 'superficie':superficie}, {
				success: function(model, response, options) {
					if(Chambre.id == nbChambres){
						$('#waitingResult').fadeOut('fast');
						$('#goodResult').css('visibility','visible');
						$('#goodResult').fadeOut(3000, function() {
							$('#goodResult').css('visibility','hidden');
						});	
					}
				},
				error: function(){
					if(Chambre.id == nbChambres){
						$('#waitingResult').fadeOut('fast');
						$('#badResult').css('visibility','visible');
						$('#badResult').fadeOut(15000, function() {
							$('#badResult').css('visibility','hidden');
						});	
					}
				}
			});
			console.log(Chambre);
		});

		//window.idHouseConfig à mettre dans le cache
//		tpl.updateFile(window.idHouseConfig, chambres.toJSON(),function(reponse){	
//		console.log(reponse);
//		});


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