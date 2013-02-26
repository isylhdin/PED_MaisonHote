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
		
		this.render();
		_.bindAll( this, 'onError' );
		
		/** TODO : Binder les différentes chambres à l'UI de telle sorte que quand il y a une erreur à la validation des modèles,
		 *  c'est l'UI qui récupère l'erreur
		 */
//		window["chambre"+i].on('error', this.onError, this);
//		this.model.bind( 'error', this.onError );

	},

	render: function () {
		$(this.el).html(_.template(tpl.get('SelectChambreView')));
		// $(this.el).append("<div id='maison'></div>");
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
		}
		this.submit();
	},

	displayRoomConfigForms: function(event){
		nbChambre = $(event.currentTarget).text();
		this.constructForm(nbChambre);
	},

	onSubmit: function( e ) {

		e.preventDefault();	
		
		for(i=1;i<=nbChambre;i++){
			var price = $('#inputPrice'+i).val();
			var nbLit = $('#inputNbPerson'+i).val();
			var superficie = $('#inputArea'+i).val();
			
			
			//this.model.set({'prixParJour':price, 'nbLit':nbLit, 'superficie':superficie});		
			//chambres.get(i).save({'prixParJour':price, 'nbLit':nbLit, 'superficie':superficie});
			window["chambre"+i].save({'prixParJour':price, 'nbLit':nbLit, 'superficie':superficie}); //set les chambres dans la collection et les sauvegarde une par une dans le cache
			//window["chambre" + i].validate({'prixParJour':price, 'nbLit':nbLit, 'superficie':superficie});
			console.log(window["chambre" + i]);
			
			//console.log(chambres.get(i));
			//console.log(chambres.toJSON());
		}
		
		
		
		/**  Exemple de récupération des chambres dans le cache **/
		window.ls = new Backbone.LocalStorage("chambres-backbone");
		window.arrayChambres = ls.findAll();
		/*********************************************************/
		
		var id = tpl.createNewFile('house_config.json', function(reponse){	
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

	onInputGetFocus: function( e ) {
		this.resetFieldError( $(e.target).attr('name') );
	},

	onError: function( model, error ) {

		_.each( error, function( fieldName ) {

			this.setFieldError( fieldName );

		}, this );
		
		alert("ON PASSE DANS ONERROR");

	},


	/** set and unset "error" status on a field's control-group  **/
	setFieldError: function ( fieldName ) {

		var $controlGroup = this.getFieldControlGroup( this.getField(fieldName) );

		$controlGroup.addClass('error');

	},

	resetFieldError: function( fieldName ) {

		var $controlGroup = this.getFieldControlGroup( this.getField(fieldName) );

		$controlGroup.removeClass('error');

	},

	getField: function( fieldName ) {

		return $('input[name='+fieldName+']');

	},


	getFieldControlGroup: function( $field ) {

		return $field.parents('.control-group');

	}

});
