window.SelectChambreView = Backbone.View.extend({

	events : {
		"click .dropdown-menu a"	: "displayRoomConfigForms",
		"click #submit"  : "onSubmit",
		"focus input"	 : "onInputGetFocus",
		"click #btnAddServ" : "constructFormService"
	},


	initialize: function () {
		nbPrest=0;
		var prestations;
		var nbChambre;
		var chambres;
		var success = true;
		this.render();
	},

	render: function () {
		$(this.el).html(_.template(tpl.get('SelectChambreView')));
		return this;
	},

	// submit : function(){
	// $('#maison').append("<div class='row'><button type='submit' id='submit' class='btn'>Enregistrer</button></div>");
	// },

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
			$('#litSimple'+i).spinner();
			$('#litDouble'+i).spinner();
			$('#litJumeau'+i).spinner();
			$('#'+i).remove();

			window["chambre"+i].bind('invalid ', this.onError);
		}
		// this.submit();
	},

	displayRoomConfigForms: function(event){
		nbChambre = $(event.currentTarget).text();
		this.constructForm(nbChambre);
	},

	constructFormService: function () {
		nbPrest = nbPrest+1;
		if(nbPrest==1){
			prestations = new Prestations();
		}
		window["prestation"+nbPrest] = new Prestation({'id':nbPrest});
		window["prestation"+nbPrest].bind('invalid ', this.onError);
		
		prestations.add(window["prestation"+nbPrest]);
		this.template = _.template(tpl.get('ServiceView'));
		$('#prestation').append(this.template(window["prestation"+nbPrest].toJSON()));
		$('#'+nbPrest).remove();
	},

	saveDataRoom: function(){
		for(i=1;i<=nbChambre;i++){
			var price = $('#inputPrice'+i).val();

			var litSimple = $('#litSimple'+i).val();
			var litDouble = $('#litDouble'+i).val();
			var litJumeau = $('#litJumeau'+i).val();

			var tele = $("input[name=tele"+i+"]").is(':checked');
			var internet = $("input[name=internet"+i+"]").is(':checked');
			var baignoire = $("input[name=baignoire"+i+"]").is(':checked');
			var douche = $("input[name=douche"+i+"]").is(':checked');

			//set les chambres dans la collection et les sauvegarde une par une dans le cache
			window["chambre"+i].save({'prixParJour':price,'tele':tele, 'internet':internet, 'baignoire':baignoire, 'douche':douche, 'litSimple': litSimple, 'litDouble': litDouble, 'litJumeau': litJumeau}); 
		}	
	},

	//creation du fichier house_config_chambres
	createFileChambre: function(){	
		createNewFile('house_config_chambres.json', function(reponse){	
			window.idHouseConfig = reponse.id;

			//on conserve l'id du fichier dans le cache pour pouvoir utiliser le web service d'update dessus (a besoin de son id)
			var houseConfig = new FichierConfig({'id':reponse.title, 'idFichier': idHouseConfig });
			houseConfig.save();

			updateFile(reponse.id,  JSON.stringify(chambres.toJSON()),function(reponse){	
				console.log(reponse);
			});

		});
	},

	saveDataService: function(){
		for(i=1;i<=nbPrest;i++){
			console.log("passage dans la boucle");
			var titleP = $('#title'+i).val();
			var priceP = $('#price'+i).val();
			var commentP = $('#comment'+i).val();

			//set les chambres dans la collection et les sauvegarde une par une dans le cache
			window["prestation"+i].save({'title':titleP,'price':priceP, 'comment':commentP}); 
		}
	},

	//creation du fichier house_config_prestations
	createFileService: function(){
		createNewFile('house_config_prestations.json', function(reponse){	
			window.idHouseConfig = reponse.id;

			//on conserve l'id du fichier dans le cache pour pouvoir utiliser le web service d'update dessus (a besoin de son id)
			var houseConfig = new FichierConfig({'id':reponse.title, 'idFichier': idHouseConfig });
			houseConfig.save();

			if (typeof(prestations) !== 'undefined'){
				updateFile(reponse.id,  JSON.stringify(prestations.toJSON()),function(reponse){	
					console.log(reponse);
				});
			}

		});
	},


	createFileClient: function(){
		createNewFile('house_clients.json', function(reponse){	
			window.idClient = reponse.id;

			//on conserve l'id du fichier dans le cache pour pouvoir utiliser le web service d'update dessus (a besoin de son id)
			var clientFile = new FichierConfig({'id':reponse.title, 'idFichier': idClient });
			clientFile.save();

		});
	},

	onSubmit: function(e){
		success = true;
		e.preventDefault();	

		//partie chambre
		this.saveDataRoom();

		//partie prestation
		this.saveDataService();

		if(!success){
			return;
		}

		this.createFileChambre();

		this.createFileService();

		this.createFileClient();

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
