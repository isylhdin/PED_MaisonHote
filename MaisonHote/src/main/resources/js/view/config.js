window.SelectChambreView = Backbone.View.extend({

	events : {
		"click #1"		 : "un",
		"click #2"		 : "deux",
		"click #3"	 	 : "trois",
		"click #4"		 : "quatre",
		"click #5"	 	 : "cinq",
		"click #submit"  : "onSubmit",
		"focus input"	 : "onInputGetFocus"
	},
	

	initialize: function () {
		var nbChambre;
		var chambres;
		
		this.render();
		_.bindAll( this, 'onError' );
		this.model.bind( 'error', this.onError );

	},

	render: function () {
		$(this.el).html(_.template(tpl.get('SelectChambreView')));
		$(this.el).append("<div id='maison'></div>");
		return this;
	},

	submit : function(){
		$('#maison').append("<div class='row'><button type='submit' id='submit' class='btn'>Enregistrer</button></div>");
	},
	
	//Quand on clique sur un numéro de la liste on construit l'ui (avec les id pas encore définis).
	//Chaque "input" doit avoir un id modifié dynamiquement
	constructForm: function(nbChambre){
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

	un : function(event){
		nbChambre = 1;
		this.constructForm(nbChambre);
	},
	
	deux : function(event){
		nbChambre = 2;
		this.constructForm(nbChambre);
	},

	trois : function(event){
		nbChambre = 3;
		this.constructForm(nbChambre);
	},

	quatre : function(event){
		nbChambre = 4;
		this.constructForm(nbChambre);

	},

	cinq : function(event){
		nbChambre = 5;
		this.constructForm(nbChambre);

	},

	onSubmit: function( e ) {

		e.preventDefault();	
		
		for(i=1;i<=nbChambre;i++){
			var price = $('#inputPrice'+i).val();
			var nbLit = $('#inputNbPerson'+i).val();
			var superficie = $('#inputArea'+i).val();
					
			chambres.get(i).set({'prixParJour':price, 'nbLit':nbLit, 'superficie':superficie});
			console.log(chambres.get(i));
			console.log(chambres.get(i).toJSON());
		}
	},

	onInputGetFocus: function( e ) {
		this.resetFieldError( $(e.target).attr('name') );
	},

	onError: function( model, error ) {

		_.each( error, function( fieldName ) {

			this.setFieldError( fieldName );

		}, this );

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
