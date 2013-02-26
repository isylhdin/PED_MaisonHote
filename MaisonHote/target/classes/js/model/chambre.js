
var Chambre = Backbone.Model.extend({
	defaults: {
		id:null,
		prixParJour: '',
		nbLit: '',
		superficie :''
	},

	initialize: function(){
		console.log('Chambre créée !');
	},

	validate: function( attrs ) {

		var errors = [];
		console.log(attrs);
		if ( !attrs.prixParJour.length ) errors.push('prixParJour');
		if ( !attrs.nbLit.length ) errors.push('nbLit');
		if ( !attrs.superficie.length ) errors.push('superficie');

		if ( errors.length ){
			console.log("champ qui provoquent une erreur : "+errors);
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