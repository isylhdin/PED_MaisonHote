window.SelectChambreView = Backbone.View.extend({

	events : {
		"click .dropdown-menu a"	: "displayRoomConfigForms",
		"click #submit"  : "onSubmit",
		"focus input"	 : "onInputGetFocus",
		"click #addServ" : "addServ"
	},


	initialize: function () {
		var nbChambre;
		var chambres;
		var success = true;
		
		this.render();
	},

	render: function () {
		$(this.el).html(_.template(tpl.get('SelectChambreView')));
		return this;
	},

	submit : function(){
		$('#maison').append("<div class='row'><button type='submit' id='submit' class='btn'>Enregistrer</button></div>");
	},

	addServ: function () {
		$('#prestation').append(_.template(tpl.get('ServiceView')));
	},

	//Quand on clique sur un numéro de la liste on construit l'ui (avec les id pas encore définis).
	//Chaque "input" doit avoir un id modifié dynamiquement
	constructForm: function(nbChambre){
		//pas top : quand on clique sur un autre item de la liste : la précédente collection (avec ses éléments) ne sont pas supprimés
		//=> memory leak
		chambres = new Chambres();

		$('#maison').empty();
		for(i=1;i<=nbChambre;i++){
			//crée une chambre juste pour set les id comme il faut dans le code html
			window["chambre" + i] = new Chambre({'id':i});
			//stocke les chambres crées dans une collection
			chambres.add(window["chambre" + i]);
			this.template = _.template(tpl.get('ChambreView'));
			//injecte l'id de la chambre dans le code html
			$('#maison').append(this.template(window["chambre" + i].toJSON()));	
			$('#'+i).remove();
			
			window["chambre"+i].bind('invalid ', this.onError);
		}
		this.submit();
	},

	displayRoomConfigForms: function(event){
		nbChambre = $(event.currentTarget).text();
		this.constructForm(nbChambre);
	},

	onSubmit: function(e){
		success = true;
		e.preventDefault();	

		for(i=1;i<=nbChambre;i++){
			var price = $('#inputPrice'+i).val();
			var nbLit = $('#inputNbPerson'+i).val();
			var superficie = $('#inputArea'+i).val();

			window["chambre"+i].save({'prixParJour':price, 'nbLit':nbLit, 'superficie':superficie}); //set les chambres dans la collection et les sauvegarde une par une dans le cache
		}

		if(!success){
			return;
		}
			

		tpl.createNewFile('house_config.json', function(reponse){	
			window.idHouseConfig = reponse.id;

			//on conserve l'id du fichier dans le cache pour pouvoir utiliser le web service d'update dessus (a besoin de son id)
			var houseConfig = new FichierConfig({'idFichier': window.idHouseConfig});
			houseConfig.save();

			tpl.updateFile(reponse.id, chambres.toJSON(),function(reponse){	
				console.log(reponse);
			});

		});

		//on charge le menu
		this.headerView = new HeaderView();
		$('.header').html(this.headerView.el);
		//et on redirige sur la page des réservations
		app.resa();
	},
	
	onError: function( model, error) {
		success = window.validateForm.onError(model, error, this);
	},

	onInputGetFocus: function( e ) {
		 window.validateForm.onInputGetFocus(e);
	}
});
