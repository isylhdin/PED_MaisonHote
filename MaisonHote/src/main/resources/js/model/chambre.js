var Chambre = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage("chambres-backbone"),
	
	defaults: {
		id:null,
		prixParJour: '',
		nbLit: '',
		superficie :''
	},

	initialize: function(){
		console.log('Chambre créée !');
		var error = this.validate(this.attributes);
	    if (error) {
	      this.trigger('error', this, error);
	    }
	},

	validate: function( attrs ) {

		var errors = [];
		if ( !attrs.prixParJour.length ) errors.push('prixParJour');
		if ( !attrs.nbLit.length ) errors.push('nbLit');
		if ( !attrs.superficie.length ) errors.push('superficie');

		if ( errors.length ){
			console.log("champ(s) qui provoque(nt) une erreur : "+errors);
			return errors;
		}
	}
});

var Chambres = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("chambres-backbone"),
	model: Chambre,

	initialize : function() {
		console.log('Collection de chambres crée');

	}
}); 