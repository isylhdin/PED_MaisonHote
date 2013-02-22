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
	
	//Quand on clique sur un numéro de la liste on construit l'ui (avec les id pas encore définis). Chaque "input" doit avoir un id modifié dynamiquement
	//marche pas encore
	constructForm: function(nbChambre){
		$('#maison').empty();
		for(i=0;i<nbChambre;i++){
			//met tous les id des éléments comme il faut
			this.template = _.template(tpl.get('ChambreView'));
			$('#maison').append(this.template(i));	
		}
	},

	un : function(event){
		nbChambre = 1;
		$('#maison').empty();
		$('#maison').append(_.template(tpl.get('ChambreView')));
		this.submit();
	},
	

	deux : function(event){
		nbChambre = 2;
		$('#maison').empty();
		for(i=0;i<2;i++){
			$('#maison').append(_.template(tpl.get('ChambreView')));
		}
		this.submit();
	},

	trois : function(event){
		nbChambre = 3;
		$('#maison').empty();
		for(i=0;i<3;i++){
			$('#maison').append(_.template(tpl.get('ChambreView')));
		}
		this.submit();
	},

	quatre : function(event){
		nbChambre = 4;
		$('#maison').empty();
		for(i=0;i<4;i++){
			$('#maison').append(_.template(tpl.get('ChambreView')));
		}
		this.submit();

	},

	cinq : function(event){
		nbChambre = 5;
		$('#maison').empty();
		for(i=0;i<5;i++){
			$('#maison').append(_.template(tpl.get('ChambreView')));
		}
		this.submit();

	},

	onSubmit: function( e ) {

		e.preventDefault();	
		

		for(i=0;i<nbChambre;i++){
			var price = $('#inputPrice').val();
			var nbLit = $('#inputNbPerson').val();
			var superficie = $('#inputArea').val();
			
			var chambre = new Chambre({'prixParJour':price});
			console.log(chambre);
		}
		
//		this.chambre.set({
//				prixParJour:	this.$('input[name=inputPrice]').val(),
//				nbLit:	this.$('input[name=inputNbPerson]').val()
//				superficie : this.$('input[name=inputArea]').val()
//			});
//		this.model.set({
//			prixParJour:	this.$('input[name=inputPrice]').val(),
//			nbLit:	this.$('input[name=inputNbPerson]').val()
//			superficie : this.$('input[name=inputArea]').val()
//		});

		alert("ok");
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
