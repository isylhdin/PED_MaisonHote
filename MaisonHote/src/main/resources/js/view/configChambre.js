window.EditChambreView = Backbone.View.extend({

	events : {
		"click .btn-danger"  : "onDelete",
		"click .btn-success"  : "onAdd",
		"click #submit"  : "onSubmit"

	},

	initialize: function () {
		this.render();
	},

	footpage : function(){
		$(this.el).append("<div class='row' id='add'> <a class='btn btn-success' href='#'><i class='icon-plus icon-white'></i> Ajouter</a></div>");
		$(this.el).append("<div class='row'><button type='submit' id='submit' class='btn'>Enregistrer</button></div>");
		$(this.el).append("<div id='goodResult' style='visibility:hidden' class='alert alert-success'>Vos données ont été sauvegardées avec succès ! </div>");
		$(this.el).append("<div id='badResult'  style='visibility:hidden' class='alert alert-error'>Une erreur est survenue lors de la sauvegarde. Veuillez réessayer</div>");
	},

	render: function (){
		window.nbChambres = 0;
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
		var id = $(event.currentTarget).data('id');
		nbChambres--;

		//supprime la chambre de la collection
		var chambre =  window.chambres.get(id);
		chambres.remove(chambre);

		//supprime la vue
		$('#row'+id).remove();	
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

		chambres.each(function(Chambre){
			window.price = $('#inputPrice'+Chambre.id).val();
			window.nbLit = $('#inputNbPerson'+Chambre.id).val();
			window.superficie = $('#inputArea'+Chambre.id).val();

			Chambre.save({'prixParJour':price, 'nbLit':nbLit, 'superficie':superficie}, {
				success: function(model, response, options) {
					if(Chambre.id == nbChambres){
						$('#goodResult').css('visibility','visible');
						$('#goodResult').fadeOut(3000);
					}
				},
				error: function(){
					if(Chambre.id == nbChambres){
						$('#badResult').css('visibility','visible');
						$('#badResult').fadeOut(15000);
					}
				}
			});
			console.log(Chambre);
		});
		
		//window.idHouseConfig à mettre dans le cache
//		tpl.updateFile(window.idHouseConfig, chambres.toJSON(),function(reponse){	
//			console.log(reponse);
//		});


	}

});